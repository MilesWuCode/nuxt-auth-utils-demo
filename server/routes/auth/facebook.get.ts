import { getCookie } from 'h3'
import { getExpiredAt, randomString } from '#shared/utils/auth'

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
      },
      token: {
        accessToken: randomString(),
        accessTokenExpiredAt: getExpiredAt(60),
        refreshToken: randomString(),
        refreshTokenExpiredAt: getExpiredAt(120),
      },
      loggedInAt: Date.now(),
    })

    return sendRedirect(event, redirectedFrom)
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('Google OAuth error:', error)

    return sendRedirect(event, '/')
  },
})
