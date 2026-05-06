import { getExpiredAt, randomString } from '#shared/utils/auth'
import { getCookie } from 'h3'

export default defineOAuthAppleEventHandler({
  async onSuccess(event, { user, tokens }) {
    // cookie取返回頁路徑
    const redirectedFrom = getCookie(event, 'redirectedFrom') ?? '/'

    console.log(user)
    console.log(tokens.id_token)

    await setUserSession(event, {
      user: {
        id: user.email!,
        name: user.name!.firstName!,
        email: user.email!,
        fetched_at: Date.now(),
      },
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
    console.error('Apple OAuth error:', error)

    return sendRedirect(event, '/')
  },
})
