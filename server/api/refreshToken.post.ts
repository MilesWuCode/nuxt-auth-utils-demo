import { isExpired } from '#shared/utils/auth'
import { jwtVerify, errors } from 'jose'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const refreshToken = session.secure?.refreshToken
  const refreshTokenExpiredAt = session.tokenExpiredAt?.refreshTokenExpiredAt

  // 沒有refreshToken / refreshToken已過期
  if (!refreshToken || isExpired(refreshTokenExpiredAt)) {
    throw createError({
      status: 401,
      message: 'Unauthorized',
    })
  }

  const { jwtSecret } = useRuntimeConfig(event)

  const secret = new TextEncoder().encode(jwtSecret)

  let sub: string | undefined

  try {
    const { payload } = await jwtVerify(refreshToken, secret)

    sub = payload.sub
  } catch (err) {
    switch (true) {
      case err instanceof errors.JWTExpired:
        throw createError({ status: 401, message: 'JWT Expired' })
      case err instanceof errors.JWTInvalid:
        throw createError({ status: 401, message: 'JWT Invalid' })
      case err instanceof errors.JWSInvalid:
        throw createError({ status: 401, message: 'JWS Invalid' })
      case err instanceof errors.JWSSignatureVerificationFailed:
        throw createError({
          status: 401,
          message: 'JWS Signature Verification Failed',
        })
      default:
        throw createError({ status: 500, message: 'Auth Error' })
    }
  }

  // token沒有sub
  if (!sub) {
    throw createError({ status: 401, message: 'Invalid token' })
  }

  const { secure, tokenExpiredAt } = await createTokens(sub)

  // 不要展開...session(裡面還混了session.id，不該寫回session data)
  await setUserSession(event, {
    user: session.user,
    loggedInAt: session.loggedInAt,
    secure: secure,
    tokenExpiredAt: tokenExpiredAt,
  })

  console.log('refreshToken')

  setResponseStatus(event, 204)
})
