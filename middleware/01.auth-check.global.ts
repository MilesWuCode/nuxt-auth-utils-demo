import { appendResponseHeader } from 'h3'
import { parse, parseSetCookie, serialize } from 'cookie-es'
import { isExpired } from '#shared/utils/auth'

export default defineNuxtRouteMiddleware(async () => {
  const nuxtApp = useNuxtApp()

  // Don't run on client hydration when server rendered
  if (
    import.meta.client &&
    nuxtApp.isHydrating &&
    nuxtApp.payload.serverRendered
  ) {
    return
  }

  const { session, clear, fetch } = useUserSession()
  const serverEvent = useRequestEvent()
  const runtimeConfig = useRuntimeConfig()

  if (
    // 檢查accessToken和refreshToken都過期
    session.value?.token &&
    isExpired(session.value.token.accessTokenExpiredAt ?? 0) &&
    isExpired(session.value.token.refreshTokenExpiredAt ?? 0)
  ) {
    // 直接登出
    await clear()
  }

  if (
    // 只檢查accessToken過期，refreshToken未過期
    session.value?.token &&
    isExpired(session.value.token.accessTokenExpiredAt ?? 0) &&
    !isExpired(session.value.token.refreshTokenExpiredAt ?? 0)
  ) {
    console.info('access token expired, refreshing')

    // refresh token
    await useRequestFetch()('/api/refreshToken', {
      method: 'POST',
      onResponse({ response: { headers } }) {
        // Forward the Set-Cookie header to the main server event
        if (import.meta.server && serverEvent) {
          for (const setCookie of headers.getSetCookie()) {
            appendResponseHeader(serverEvent, 'Set-Cookie', setCookie)
            // Update session cookie for next fetch requests
            const { name, value } = parseSetCookie(setCookie)
            if (name === runtimeConfig.session.name) {
              // console.log('updating headers.cookie to', value)
              const cookies = parse(serverEvent.headers.get('cookie') || '')
              // set or overwrite existing cookie
              cookies[name] = value
              // update cookie event header for future requests
              serverEvent.headers.set(
                'cookie',
                Object.entries(cookies)
                  .map(([name, value]) => serialize(name, value))
                  .join('; '),
              )
              // Also apply to serverEvent.node.req.headers
              if (serverEvent.node?.req?.headers) {
                serverEvent.node.req.headers['cookie'] =
                  serverEvent.headers.get('cookie') || ''
              }
            }
          }
        }
      },
    })
    // refresh the session
    await fetch()
  }
})
