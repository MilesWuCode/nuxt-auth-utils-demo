import { isExpired } from '#shared/utils/auth'
import { jwtVerify, errors } from 'jose'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (
    // 沒有token / 沒有refreshToken / refreshToken已過期
    !session.token ||
    !session.token.refreshToken ||
    isExpired(session.token.refreshTokenExpiredAt)
  ) {
    throw createError({
      status: 401,
      statusText: 'Invalid credentials',
    })
  }

  const { jwtSecret } = useRuntimeConfig()

  const secret = new TextEncoder().encode(jwtSecret)

  let sub: string | undefined

  try {
    const { payload } = await jwtVerify(session.token.refreshToken, secret)

    sub = payload.sub
  } catch (err) {
    switch (true) {
      case err instanceof errors.JWTExpired:
        throw createError({ status: 401, statusText: 'JWT Expired' })
      case err instanceof errors.JWTInvalid:
        throw createError({ status: 401, statusText: 'JWT Invalid' })
      case err instanceof errors.JWSInvalid:
        throw createError({ status: 401, statusText: 'JWS Invalid' })
      case err instanceof errors.JWSSignatureVerificationFailed:
        throw createError({
          status: 401,
          statusText: 'JWS Signature Verification Failed',
        })
      default:
        throw createError({ status: 500, statusText: 'Auth Error' })
    }
  }

  if (
    // token沒有sub
    !sub
  ) {
    throw createError({ status: 401, statusText: 'Invalid token' })
  }

  await setUserSession(event, {
    // 不要展開...session(裡面還混了session.id，不該寫回session data)
    user: session.user,
    loggedInAt: session.loggedInAt,
    token: await createTokens(sub),
  })

  console.log('refreshToken')

  setResponseStatus(event, 204)
})
