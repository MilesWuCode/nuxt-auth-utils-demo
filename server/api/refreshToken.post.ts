import { isExpired, getExpiredAt } from '#shared/utils/auth'
import { jwtVerify, SignJWT, errors } from 'jose'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (
    // 沒有session
    !session.token
  ) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials',
    })
  }

  if (
    // refreshToken過期
    isExpired(session.token?.refreshTokenExpiredAt)
  ) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials',
    })
  }

  if (
    // 沒有refreshToken
    !session.token.refreshToken
  ) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials',
    })
  }

  const { jwtSecret } = useRuntimeConfig()

  const secret = new TextEncoder().encode(jwtSecret)

  try {
    const { payload } = await jwtVerify(session.token.refreshToken, secret)

    // ! DEMO accessToken故意設10秒就過期，方便測試refresh流程；正式環境請依需求調整(例如15分鐘)
    const accessToken = await new SignJWT({
      sub: payload.sub,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('10s')
      .sign(secret)

    const refreshToken = await new SignJWT({
      sub: payload.sub,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1d')
      .sign(secret)

    await setUserSession(event, {
      ...session,
      token: {
        accessToken: accessToken,
        accessTokenExpiredAt: getExpiredAt(10),
        refreshToken: refreshToken,
        refreshTokenExpiredAt: getExpiredAt(86400),
      },
    })
  } catch (err) {
    if (err instanceof errors.JWTExpired) {
      throw createError({ statusCode: 401, message: 'Token expired' })
    }
    if (err instanceof errors.JWTInvalid || err instanceof errors.JWSInvalid) {
      throw createError({ statusCode: 401, message: 'Invalid token' })
    }
    if (err instanceof errors.JWSSignatureVerificationFailed) {
      throw createError({ statusCode: 401, message: 'Token tampered' })
    }

    throw createError({
      statusCode: 500,
      message: 'Auth Error',
    })
  }

  console.log('refreshToken')

  setResponseStatus(event, 204)
})
