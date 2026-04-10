// 用戶曾經在其他瀏覽器修改資料
// 當瀏覽器進入網站時
// 預設抓取瀏覽器內的用戶資料
// 所以呼叫api最得最新資料

export default defineNuxtPlugin((nuxtApp) => {
  // 剛進入時更新會員資料
  nuxtApp.hook('app:mounted', () => {
    const { loggedIn, fetch } = useUserSession()

    if (loggedIn.value) {
      $fetch('/api/me').then(fetch)
    }
  })
})
