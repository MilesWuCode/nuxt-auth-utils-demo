// 第三方登入狀態改變時
// 由 server 端寫入 authSuccess cookie
// 分頁監看到這個 cookie 變化就強制 reloadNuxtApp

export default defineNuxtPlugin(() => {
  const authSuccessCookie = useCookie('authSuccess')
  const authBroadcastChannel = useAuthBroadcastChannel()

  watch(authSuccessCookie, (value) => {
    if (!value) return

    // 因為cookie是全域的，所以全部分頁都會收到
    authBroadcastChannel.postMessage({
      action: 'login',
    })
  })
})
