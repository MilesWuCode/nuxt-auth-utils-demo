import { getCookie, setCookie } from 'h3'

export default defineOAuthGoogleEventHandler({
  config: {
    authorizationParams: {
      access_type: 'offline',
    },
  },
  async onSuccess(event, { user, tokens }) {
    // cookie取返回頁路徑
    const redirectedFrom = getCookie(event, 'redirectedFrom') ?? '/'

    console.log(user)
    console.log(tokens.access_token)
    console.log(tokens.id_token)

    await setUserSession(event, {
      user: {
        id: user.sub,
        name: user.name,
        email: user.email,
        fetched_at: Date.now(),
      },
      token: await createTokens(user.sub),
      loggedInAt: Date.now(),
    })

    // 通知其他分頁登入狀態變了，由 app/plugins/05.auth-cookie.client.ts 監看後 reloadNuxtApp
    setCookie(event, 'authSuccess', Date.now().toString(), {
      maxAge: 10,
      path: '/',
    })

    return sendRedirect(event, redirectedFrom)
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('Google OAuth error:', error)

    // flash message
    setCookie(event, 'authError', 'error-0001', {
      maxAge: 10,
      path: '/',
    })

    return sendRedirect(event, '/login')
  },
})
