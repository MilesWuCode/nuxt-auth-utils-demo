import { isExpired, getExpiredAt, randomString } from '#shared/utils/auth'

export default defineEventHandler(async (event) => {
  // const url = getRequestURL(event)

  // if (!url.pathname.startsWith('/api/')) return

  // 已知問題
  // SSR進入頁面後，若多支API發出請求，會造成多支更換token的行為
  // 應想辦法判別出SSR還是CSR的API請求

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
