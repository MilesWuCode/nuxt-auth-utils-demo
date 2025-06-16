// 會員限定頁

export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  if (import.meta.server && !loggedIn.value) {
    return navigateTo(`/login?redirectedFrom=${to.fullPath}`)
  }

  if (import.meta.client && !loggedIn.value) {
    return navigateTo('/login')
  }
})
