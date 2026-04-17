// 當瀏覽器切換分頁時
// 用$fetch抓取用戶資料更新session
// 再用useUserSession的fetch更新會員資料

export default defineNuxtPlugin(() => {
  const isVisible = ref(true)

  const handleVisibilityChange = async () => {
    isVisible.value = document.visibilityState === 'visible'

    const { loggedIn, fetch } = useUserSession()

    try {
      if (
        // 返回瀏覽器 和 有登入
        loggedIn.value &&
        isVisible.value
      ) {
        await $fetch('/api/me')
        await fetch()
      } else {
        // console.log("會員離開瀏覽器");
      }
    } catch {
      reloadNuxtApp()
    }
  }

  // 監聽瀏覽器狀態
  document.addEventListener('visibilitychange', handleVisibilityChange)
})
