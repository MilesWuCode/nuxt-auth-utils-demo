export default defineNuxtPlugin(() => {
  const isVisible = ref(true);

  const handleVisibilityChange = async () => {
    isVisible.value = document.visibilityState === "visible";

    const { loggedIn, fetch, clear } = useUserSession();

    if (loggedIn.value && isVisible.value) {
      // console.log('會員返回瀏覽器時更新會員資料')

      await $fetch("/api/me")
        .then(async () => {
          await fetch();
        })
        .catch(async () => {
          await clear();
        });
    } else {
      // console.log("會員離開瀏覽器");
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
