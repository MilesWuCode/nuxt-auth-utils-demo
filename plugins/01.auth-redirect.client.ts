// 在client登出時自動換頁

export default defineNuxtPlugin(() => {
  const route = useRoute();

  const { loggedIn } = useUserSession();

  watch(loggedIn, async (val) => {
    // 若是未登入,判別middleware是不是auth
    if (
      !val &&
      Array.isArray(route.meta.middleware) &&
      route.meta.middleware.includes("auth")
    ) {
      // 導回首頁
      await navigateTo("/");
    }
  });
});
