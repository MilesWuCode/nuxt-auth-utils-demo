export default defineNuxtPlugin(() => {
  const { loggedIn, fetch } = useUserSession()

  window.addEventListener('storage', async () => {
    const userAuthStatus = localStorage
      .getItem('user-auth-status')
      ?.split(':')
      .at(0)

    if (!loggedIn.value && userAuthStatus === 'login') {
      reloadNuxtApp({ force: true })
    } else if (loggedIn.value && userAuthStatus === 'logout') {
      reloadNuxtApp({ force: true })
    } else if (loggedIn.value && userAuthStatus === 'fetch user data') {
      await $fetch('/api/me')
      await fetch()
    }
  })
})
