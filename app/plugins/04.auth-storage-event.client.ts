// 登入/登出/修改資料，localStorage寫入user-auth-status
// localStorage事件通知其他分頁做出相應的動作
// 通常網站不會用到[登入]時其他頁面同時登入
// 登入成功寫入`login`
// 登出成功寫入`logout`
// 更新用戶資料寫入`fetch user data:${Date.now()}`

export default defineNuxtPlugin(() => {
  const { loggedIn, fetch } = useUserSession()

  window.addEventListener('storage', async () => {
    const userAuthStatus = localStorage
      .getItem('user-auth-status')
      ?.split(':')
      .at(0)

    if (!loggedIn.value && userAuthStatus === 'login') {
      reloadNuxtApp({ force: true })
    } else if (loggedIn.value && userAuthStatus === 'logout') {
      reloadNuxtApp({ force: true })
    } else if (loggedIn.value && userAuthStatus === 'fetch user data') {
      await $fetch('/api/me')
      await fetch()
    }
  })
})
