import { getExpiredAt, randomString } from '#shared/utils/auth'
import { getCookie } from 'h3'

export default defineOAuthFacebookEventHandler({
  async onSuccess(event, { user, tokens }) {
    // cookie取返回頁路徑
    const redirectedFrom = getCookie(event, 'redirectedFrom') ?? '/'

    console.log(user)
    console.log(tokens.access_token)

    await setUserSession(event, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        fetched_at: Date.now(),
      },
      // ! DEMO accessToken故意設15秒就過期，方便測試refresh流程；正式環境請依需求調整(例如15分鐘)
      token: {
        accessToken: randomString(),
        accessTokenExpiredAt: getExpiredAt(15),
        refreshToken: randomString(),
        refreshTokenExpiredAt: getExpiredAt(86400),
      },
      loggedInAt: Date.now(),
    })

    return sendRedirect(event, redirectedFrom)
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('Facebook OAuth error:', error)

    return sendRedirect(event, '/')
  },
})
