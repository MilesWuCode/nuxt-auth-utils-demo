// 用戶登出時，若在auth限定的頁面，則自動換頁

export default defineNuxtPlugin(() => {
  const route = useRoute()

  const { loggedIn } = useUserSession()

  watch(loggedIn, async (val) => {
    if (
      // 若是未登入,判別middleware是不是auth
      !val &&
      Array.isArray(route.meta.middleware) &&
      route.meta.middleware.includes('auth')
    ) {
      // 導回首頁
      await navigateTo('/')
    }
  })
})
