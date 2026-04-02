import { isExpired, getExpiredAt, randomString } from '#shared/utils/auth'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (
    // 沒有session
    !session
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

  await setUserSession(event, {
    token: {
      accessToken: randomString(),
      accessTokenExpiredAt: getExpiredAt(15),
      refreshToken: randomString(),
      refreshTokenExpiredAt: getExpiredAt(3000),
    },
  })

  console.log('api/refreshToken')

  return setResponseStatus(event, 204)
})
