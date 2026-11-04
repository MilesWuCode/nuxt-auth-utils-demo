// 共用的fetch攔截邏輯:accessToken過期就refresh、401就導回登入頁
// 給 useApi(useFetch版本) 和 $api(plugins/api.ts,$fetch版本) 共用,避免各自實作導致行為分岔

export function useAuthFetchOptions() {
  return {
    async onRequest() {
      // SSR的刷新交給 middleware/01.refresh-token.global.ts
      // server端的全域$fetch不會帶使用者cookie,在這裡刷新一定失敗,還會因為catch裡的clear()把使用者登出
      if (import.meta.server) return

      const { session, fetch, clear } = useUserSession()

      const { accessTokenExpiredAt, refreshTokenExpiredAt } =
        session.value?.tokenExpiredAt ?? {}

      if (
        // accessToken過期、refreshToken未過期才刷新
        isExpired(accessTokenExpiredAt) &&
        !isExpired(refreshTokenExpiredAt)
      ) {
        try {
          await $fetch('/api/refreshToken', { method: 'POST' })
          await fetch()
        } catch {
          // refresh失敗就登出,讓原本的請求繼續打下去,交給onResponseError的401處理導回登入頁
          await clear()
        }
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
