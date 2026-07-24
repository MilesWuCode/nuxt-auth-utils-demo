// 第三方登入狀態改變時
// 由 server 端寫入 authSuccess cookie
// 分頁監看到這個 cookie 變化就強制 reloadNuxtApp

export default defineNuxtPlugin(() => {
  const authSuccessCookie = useCookie('authSuccess')
  const { loggedIn } = useUserSession()

  watch(authSuccessCookie, (value) => {
    if (!value) return

    // 已經登入的頁面不需要reload，若沒有等待1秒，原分頁會換到首頁
    setTimeout(() => {
      if (loggedIn.value) return

      reloadNuxtApp({ force: true })
    }, 1000)
  })
})
