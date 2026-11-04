import { isExpired } from '#shared/utils/auth'
import { parse, parseSetCookie, serialize } from 'cookie-es'
import { appendResponseHeader } from 'h3'

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
  if (!session.value?.token) return

  const serverEvent = useRequestEvent()
  // Same cookie name as the module: `nuxt-session` is reserved for `useSession()` from `nuxt/server`
  const configuredName = useRuntimeConfig().session?.name
  const sessionName =
    configuredName && configuredName !== 'nuxt-session'
      ? configuredName
      : 'nuxt-auth-session'
  const { accessTokenExpiredAt, refreshTokenExpiredAt } = session.value.token

  // Both tokens expired, clearing session
  if (isExpired(accessTokenExpiredAt) && isExpired(refreshTokenExpiredAt)) {
    console.info('both tokens expired, clearing session')
    await clearSession()
    // return navigateTo('/login')
  }
  // Access token expired, refreshing
  else if (isExpired(accessTokenExpiredAt)) {
    console.info('access token expired, refreshing')
    try {
      await useRequestFetch()('/api/refreshToken', {
        method: 'POST',
        onResponse({ response: { headers } }) {
          // Forward the Set-Cookie header to the main server event (h3 v1: event.node.req / event.node.res)
          if (import.meta.server && serverEvent) {
            for (const setCookie of headers.getSetCookie()) {
              appendResponseHeader(serverEvent, 'set-cookie', setCookie)
              // Update the session cookie of the request, for the next fetch requests
              const { name, value } = parseSetCookie(setCookie)
              if (name !== sessionName) continue
              const cookies = parse(serverEvent.headers.get('cookie') || '')
              // set or overwrite existing cookie
              cookies[name] = value
              const cookie = Object.entries(cookies)
                .map(([name, value]) => serialize(name, value))
                .join('; ')
              // event.headers is a cached copy of node req headers, update both
              serverEvent.headers.set('cookie', cookie)
              serverEvent.node.req.headers.cookie = cookie
            }
          }
        },
      })
    } catch {
      // refresh failed, log out
      await clearSession()
      return
    }
    // refresh the session
    await fetchSession()
  }
})
