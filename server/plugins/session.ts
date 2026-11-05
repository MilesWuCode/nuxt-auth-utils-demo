// server/plugins/session.ts
// A server plugin is a function, so this file runs on Nuxt 4 (Nitro 2) and Nuxt 5 (Nitro 3)
export default () => {
  // Called when the session is fetched during SSR for the Vue composable (/api/_auth/session)
  // Or when we call useUserSession().fetch()
  // Not called for a visitor without a session cookie: they get an empty session and no cookie is set
  sessionHooks.hook('fetch', async (session, event) => {
    // extend User Session by calling your database
    // or
    // throw createError({ ... }) if session is invalid for example
  })

  // Called when we call useUserSession().clear() or clearUserSession(event)
  sessionHooks.hook('clear', async (session, event) => {
    // Log that user logged out
    console.log('auth clear')
  })
}
