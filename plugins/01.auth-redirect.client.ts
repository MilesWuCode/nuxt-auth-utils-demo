// 在client登出時自動換頁

export default defineNuxtPlugin(() => {
  const route = useRoute();

  const { loggedIn } = useUserSession();

  watch(loggedIn, async (val) => {
    if (
      !val &&
      Array.isArray(route.meta.middleware) &&
      route.meta.middleware.includes("auth")
    ) {
      await navigateTo("/");
    }
  });
});
