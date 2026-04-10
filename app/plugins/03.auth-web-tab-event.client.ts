// 當瀏覽器切換分頁時
// 用$fetch抓取用戶資料更新session
// 再用useUserSession的fetch更新會員資料

export default defineNuxtPlugin(() => {
  const isVisible = ref(true)

  const handleVisibilityChange = async () => {
    isVisible.value = document.visibilityState === 'visible'

    const { loggedIn, fetch } = useUserSession()

    if (
      // 返回瀏覽器 和 有登入
      loggedIn.value &&
      isVisible.value
    ) {
      // 更新會員資料
      await $fetch('/api/me')
        .then(fetch)
        .catch((error) => {
          if (
            // 若token過期會401
            error.statusCode === 401
          ) {
            // 重新整理頁面
            reloadNuxtApp()
          }
        })
    } else {
      // console.log("會員離開瀏覽器");
    }
  }

  // 監聽瀏覽器狀態
  document.addEventListener('visibilitychange', handleVisibilityChange)
})
