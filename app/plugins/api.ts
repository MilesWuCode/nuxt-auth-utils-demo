export default defineNuxtPlugin((nuxtApp) => {
  const { session, fetch } = useUserSession()

  const api = $fetch.create({
    async onRequest() {
      if (
        session.value?.token &&
        isExpired(session.value.token.accessTokenExpiredAt) &&
        !isExpired(session.value.token.refreshTokenExpiredAt)
      ) {
        await $fetch('/api/refreshToken', { method: 'POST' })
        await fetch()
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo('/login'))
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})
