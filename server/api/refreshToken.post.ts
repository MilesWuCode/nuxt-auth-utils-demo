import { isExpired, getExpiredAt, randomString } from '#shared/utils/auth'

const invalidCredentialsError = createError({
  statusCode: 401,
  message: 'Invalid credentials',
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (
    // 沒有session
    !session
  ) {
    throw invalidCredentialsError
  }

  if (
    // refreshToken過期
    isExpired(session.token?.refreshTokenExpiredAt)
  ) {
    throw invalidCredentialsError
  }

  if (
    // 沒有refreshToken
    !session.token.refreshToken
  ) {
    throw invalidCredentialsError
  }

  await setUserSession(event, {
    token: {
      accessToken: randomString(),
      accessTokenExpiredAt: getExpiredAt(15),
      refreshToken: randomString(),
      refreshTokenExpiredAt: getExpiredAt(30),
    },
  })

  console.log('api/refreshToken')

  return setResponseStatus(event, 204)
})
