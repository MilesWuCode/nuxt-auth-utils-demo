import { isExpired, getExpiredAt, randomString } from '#shared/utils/auth'

export default defineEventHandler(async (event) => {
  // const url = getRequestURL(event)

  // if (!url.pathname.startsWith('/api/')) return

  const session = await getUserSession(event)

  if (
    // 檢查accessToken和refreshToken是否過期
    session.token &&
    isExpired(session.token.accessTokenExpiredAt) &&
    isExpired(session.token.refreshTokenExpiredAt)
  ) {
    await clearUserSession(event)
  } else if (
    // 檢查accessToken過期，refreshToken未過期
    session.token &&
    isExpired(session.token.accessTokenExpiredAt)
  ) {
    // 交換新的token
    await setUserSession(event, {
      ...session,
      token: {
        accessToken: randomString(),
        accessTokenExpiredAt: getExpiredAt(10),
        refreshToken: randomString(),
        refreshTokenExpiredAt: getExpiredAt(30),
      },
    })
  }
})
