// 登入/登出/修改資料
// BroadcastChannel 事件通知其他分頁做出相應的動作
// 通常網站不會用到[登入]時其他頁面同時登入
// 登入成功寫入`login`
// 登出成功寫入`logout`
// 更新用戶資料寫入`fetch-user`

export default defineNuxtPlugin(() => {
  const { fetch } = useUserSession()

  const authBroadcastChannel = new BroadcastChannel('auth')

  authBroadcastChannel.onmessage = async (event) => {
    const data = event.data

    if (data.action === 'login') {
      reloadNuxtApp({ force: true })
    } else if (data.action === 'logout') {
      reloadNuxtApp({ force: true })
    } else if (data.action === 'fetch-auth') {
      await fetch()
    } else if (data.action === 'fetch-user') {
      await $fetch('/api/me')
      await fetch()
    }
  }
})
