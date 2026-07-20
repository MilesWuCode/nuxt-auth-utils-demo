import { getCookie, setCookie } from 'h3'

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
      token: await createTokens(user.email!),
      loggedInAt: Date.now(),
    })

    return sendRedirect(event, redirectedFrom)
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('Apple OAuth error:', error)

    // flash message
    setCookie(event, 'authError', 'error-0001', {
      maxAge: 10,
      path: '/',
    })

    return sendRedirect(event, '/login')
  },
})
