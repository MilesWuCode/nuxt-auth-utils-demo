// 共用的fetch攔截邏輯:accessToken過期就refresh、401就導回登入頁
// 給 useApi(useFetch版本) 和 $api(plugins/api.ts,$fetch版本) 共用,避免各自實作導致行為分岔

export function useAuthFetchOptions() {
  return {
    async onRequest() {
      const { session, fetch } = useUserSession()

      if (
        // 有token、accessToken過期、refreshToken未過期才刷新
        session.value?.token &&
        isExpired(session.value.token.accessTokenExpiredAt) &&
        !isExpired(session.value.token.refreshTokenExpiredAt)
      ) {
        await $fetch('/api/refreshToken', { method: 'POST' })
        await fetch()
      }
    },
    async onResponseError({ response }: { response: Response }) {
      if (response.status === 401) {
        const nuxtApp = useNuxtApp()

        // 攔截器是在非同步流程中執行,用runWithContext確保navigateTo拿得到nuxt context
        await nuxtApp.runWithContext(() => navigateTo('/login'))
      }
    },
  }
}
