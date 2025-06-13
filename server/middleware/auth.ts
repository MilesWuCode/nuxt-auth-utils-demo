import { isExpired, getExpiredAt, randomString } from '#shared/utils/auth'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (session) {
    if (
      session.token &&
      isExpired(session.token.accessTokenExpiredAt) &&
      isExpired(session.token.refreshTokenExpiredAt)
    ) {
      await clearUserSession(event)
    } else if (session.token && isExpired(session.token.accessTokenExpiredAt)) {
      // 交換新的token

      await setUserSession(event, {
        ...session,
        token: {
          accessToken: randomString(),
          accessTokenExpiredAt: getExpiredAt(60),
          refreshToken: randomString(),
          refreshTokenExpiredAt: getExpiredAt(120),
        },
      })
    }
  }
})
