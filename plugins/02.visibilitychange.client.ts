export default defineNuxtPlugin(() => {
  const isVisible = ref(true);

  const handleVisibilityChange = () => {
    isVisible.value = document.visibilityState === "visible";

    if (isVisible.value) {
      console.log("使用者返回瀏覽器！");
      console.log("更新用戶資料");
    } else {
      // console.log("使用者離開瀏覽器！");
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
