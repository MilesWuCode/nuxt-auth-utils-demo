export default defineNuxtPlugin(() => {
  const isVisible = ref(true);

  const handleVisibilityChange = () => {
    isVisible.value = document.visibilityState === "visible";

    const { loggedIn } = useUserSession();

    if (loggedIn.value && isVisible.value) {
      console.log("會員返回瀏覽器！");
      console.log("更新會員資料");
    } else {
      // console.log("會員離開瀏覽器！");
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
