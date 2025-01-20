// 訪客限定頁

export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession();

  if (import.meta.server && loggedIn.value) {
    return navigateTo("/");
  }

  if (import.meta.client && loggedIn.value) {
    return abortNavigation();
  }
});
