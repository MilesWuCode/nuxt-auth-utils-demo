export default defineNuxtPlugin(() => {
  const isVisible = ref(true);

  const handleVisibilityChange = async () => {
    isVisible.value = document.visibilityState === "visible";

    const { loggedIn, fetch, clear } = useUserSession();

    if (isVisible.value) {
      // 返回瀏覽器

      if (loggedIn.value) {
        // 不同瀏覽器的同步
        // 順便檢查authorization是否合法
        await $fetch("/api/me")
          .then(async () => {
            await fetch();
          })
          .catch(async () => {
            // 失敗責登出
            await clear();
          });
      } else {
        // 未登入時同步瀏覽器分頁是否有登入
        await fetch();
      }

      // 若是登出則觸發01.auth-redirect.client
    } else {
      // 離開瀏覽器
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  // return {
  //   provide: {
  //     visibility: {
  //       isVisible,
  //     },
  //   },
  // };
});
