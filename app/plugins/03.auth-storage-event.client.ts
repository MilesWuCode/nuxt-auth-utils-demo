import { set } from 'zod'

export default defineNuxtPlugin(() => {
  const { loggedIn } = useUserSession()

  window.addEventListener('storage', () => {
    const userAuthStatus = localStorage.getItem('user-auth-status')

    if (!loggedIn.value && userAuthStatus === 'login') {
      reloadNuxtApp({ force: true })
    } else if (loggedIn.value && userAuthStatus === 'logout') {
      reloadNuxtApp({ force: true })
    } else if (loggedIn.value && userAuthStatus === 'fetch user data') {
      alert(1)
    }
  })
})
