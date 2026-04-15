export default defineNuxtPlugin(() => {
  const { loggedIn, session, fetch } = useUserSession()

  let timeout: NodeJS.Timeout

  watch(session, async (val) => {
    if (!loggedIn.value && !val?.token.accessTokenExpiredAt) return

    const accessTokenExpiredAt = val?.token.accessTokenExpiredAt ?? 0

    const randomTimestamp = (Math.floor(Math.random() * 10) + 1) * 1000

    const timestamp = accessTokenExpiredAt - randomTimestamp - Date.now()

    clearTimeout(timeout)

    if (timestamp <= 0) return

    timeout = setTimeout(async () => {
      await $fetch('/api/refreshToken', { method: 'POST' })
      await fetch()
      localStorage.setItem('user-auth-status', 'fetch auth:' + Date.now())
      console.log('05')
    }, timestamp)
  })
})
