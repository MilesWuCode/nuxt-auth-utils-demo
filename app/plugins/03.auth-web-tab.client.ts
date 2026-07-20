// 當瀏覽器切換分頁時
// 用$fetch抓取用戶資料更新session
// 再用useUserSession的fetch更新會員資料

export default defineNuxtPlugin(() => {
  const handleVisibilityChange = async () => {
    if (
      // 不是切回前景就不用管
      document.visibilityState !== 'visible'
    ) {
      return
    }

    const { loggedIn, fetch } = useUserSession()

    if (
      // 沒登入就不用管
      !loggedIn.value
    ) {
      return
    }

    try {
      await $fetch('/api/me')
      await fetch()
    } catch {
      reloadNuxtApp({ force: true })
    }
  }

  // 監聽瀏覽器狀態
  document.addEventListener('visibilitychange', handleVisibilityChange)
})
