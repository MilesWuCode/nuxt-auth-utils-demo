// 訪客限定頁

export default defineNuxtRouteMiddleware((to, from) => {
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
    loggedIn.value &&
    // 訪客頁登入後
    Array.isArray(to.meta.middleware) &&
    to.meta.middleware.includes('guest')
  ) {
    if (
      // 登入頁登入後回首頁
      from.path === '/login'
    ) {
      return navigateTo('/')
    }

    // 停止導航
    return abortNavigation()
  }
})
