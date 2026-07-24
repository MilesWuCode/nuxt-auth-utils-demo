// 登入/登出/修改資料
// BroadcastChannel 事件通知其他分頁做出相應的動作
// 通常網站不會用到[登入]時其他頁面同時登入
// 登入成功寫入`login`
// 登出成功寫入`logout`
// 更新用戶資料寫入`fetch-user`

export default defineNuxtPlugin(() => {
  const { fetch } = useUserSession()

  const authBroadcastChannel = useAuthBroadcastChannel()

  authBroadcastChannel.onmessage = async (event) => {
    const data = event.data

    switch (data.action) {
      case 'login':
      case 'logout':
        reloadNuxtApp({ force: true })
        break
      case 'fetch-auth':
        await fetch()
        break
      case 'fetch-user':
        await $fetch('/api/me')
        await fetch()
        break
    }
  }
})
