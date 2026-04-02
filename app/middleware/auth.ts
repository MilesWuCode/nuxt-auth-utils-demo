// 會員限定頁

export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  if (
    // 若沒有登入和SSR時
    import.meta.server &&
    !loggedIn.value
  ) {
    // 導航到登入頁並且加入redirectedFrom
    return navigateTo(`/login?redirectedFrom=${to.fullPath}`)
  }

  if (
    // 若沒有登入和nuxtlink進入
    import.meta.client &&
    !loggedIn.value
  ) {
    // 導到登入頁
    return navigateTo('/login')
  }
})
