// 第三方登入狀態改變時
// 由 server 端寫入 authSuccess cookie
// 其他分頁監看到這個 cookie 變化就強制 reloadNuxtApp

export default defineNuxtPlugin(() => {
  const authSuccessCookie = useCookie('authSuccess')

  watch(authSuccessCookie, (value) => {
    if (!value) return

    reloadNuxtApp({ force: true })
  })
})
