import { isExpired } from '#shared/utils/auth'
import { parse, parseSetCookie, serialize } from 'cookie-es'

export default defineNuxtRouteMiddleware(async () => {
  const nuxtApp = useNuxtApp()
  // Don't run on client hydration when server rendered
  if (
    import.meta.client &&
    nuxtApp.isHydrating &&
    nuxtApp.payload.serverRendered
  )
    return

  const { session, clear: clearSession, fetch: fetchSession } = useUserSession()
  // Ignore if no tokens
  if (!session.value?.tokenExpiredAt) return

  const serverEvent = useRequestEvent()
  // Same cookie name as the module: `nuxt-session` is reserved for `useSession()` from `nuxt/server`
  const configuredName = useRuntimeConfig().session?.name
  const sessionName =
    configuredName && configuredName !== 'nuxt-session'
      ? configuredName
      : 'nuxt-auth-session'
  const { accessTokenExpiredAt, refreshTokenExpiredAt } =
    session.value.tokenExpiredAt

  // Both tokens expired, clearing session
  if (isExpired(accessTokenExpiredAt) && isExpired(refreshTokenExpiredAt)) {
    // console.info('both tokens expired, clearing session')
    await clearSession()
    // return navigateTo('/login')
  }
  // Access token expired, refreshing
  else if (isExpired(accessTokenExpiredAt)) {
    // console.info('access token expired, refreshing')
    try {
      await useRequestFetch()('/api/refreshToken', {
        method: 'POST',
        onResponse({ response: { headers } }) {
          // Forward the Set-Cookie header to the main server event
          if (import.meta.server && serverEvent) {
            // Nitro 3 events have web request and response headers, Nitro 2 (h3 v1) events the Node.js ones
            const { req, res } = serverEvent as unknown as {
              req: {
                headers: Headers | Record<string, string | string[] | undefined>
              }
              res: {
                headers?: Headers
                appendHeader?: (name: string, value: string) => void
              }
            }
            for (const setCookie of headers.getSetCookie()) {
              if (res.headers) res.headers.append('set-cookie', setCookie)
              else res.appendHeader?.('set-cookie', setCookie)
              // Update the session cookie of the request, for the next fetch requests
              const { name, value } = parseSetCookie(setCookie)
              if (name === sessionName) {
                const cookies = parse(
                  String(
                    (req.headers instanceof Headers
                      ? req.headers.get('cookie')
                      : req.headers.cookie) || '',
                  ),
                )
                // set or overwrite existing cookie
                cookies[name] = value
                const cookie = Object.entries(cookies)
                  .map(([name, value]) => serialize(name, value))
                  .join('; ')
                if (req.headers instanceof Headers)
                  req.headers.set('cookie', cookie)
                else req.headers.cookie = cookie
              }
            }
          }
        },
      })
    } catch {
      // 換失敗清掉session
      // 不然永遠進不去網頁
      clearSession()
    }

    // refresh the session
    await fetchSession()
  }
})
