// 訪客限定頁

export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  if (
    // 若有登入和SSR時
    import.meta.server &&
    loggedIn.value
  ) {
    // 導航到首頁
    return navigateTo('/')
  }

  if (
    // 若有登入和nuxtlink進入
    import.meta.client &&
    loggedIn.value
  ) {
    if (
      // 訪客頁登入後
      Array.isArray(to.meta.middleware) &&
      to.meta.middleware.includes('guest')
    ) {
      // 回首頁
      return navigateTo('/')
    } else {
      // 停止導航
      return abortNavigation()
    }
  }
})
