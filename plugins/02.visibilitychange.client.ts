export default defineNuxtPlugin(() => {
  const isVisible = ref(true);

  const handleVisibilityChange = async () => {
    isVisible.value = document.visibilityState === "visible";

    const { fetch } = useUserSession();

    if (isVisible.value) {
      // console.log('返回瀏覽器')

      // 無關登入先更新session
      await fetch();

      // 若是登出則觸發01.auth-redirect.client
    } else {
      // console.log("離開瀏覽器");
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
