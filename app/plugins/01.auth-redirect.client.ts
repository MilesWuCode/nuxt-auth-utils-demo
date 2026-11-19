// 用戶登出時，若在auth限定的頁面，則自動換頁

export default defineNuxtPlugin(() => {
  const route = useRoute()

  const { loggedIn } = useUserSession()
  const authBroadcastChannel = useAuthBroadcastChannel()

  // middleware 可能來自 definePageMeta（route.meta.middleware）
  // 或 nuxt.config routeRules 的 appMiddleware（不會寫進 route.meta，需透過 getRouteRules 取得）
  function isAuthRoute() {
    const pageMiddleware = route.meta.middleware
    const pageHasAuth = Array.isArray(pageMiddleware)
      ? pageMiddleware.includes('auth')
      : pageMiddleware === 'auth'

    if (pageHasAuth) {
      return true
    }

    const appMiddleware = getRouteRules({ path: route.path }).appMiddleware as
      Record<string, boolean> | undefined

    if (
      appMiddleware &&
      'auth' in appMiddleware &&
      appMiddleware.auth === true
    ) {
      return true
    }

    return false
  }

  watch(loggedIn, async (val) => {
    if (val) {
      authBroadcastChannel.postMessage({ action: 'login' })
    } else {
      authBroadcastChannel.postMessage({ action: 'logout' })
    }

    // 若是未登入,判別middleware是不是auth
    if (!val && isAuthRoute()) {
      // 導回首頁
      await navigateTo('/login')
    }
  })
})
