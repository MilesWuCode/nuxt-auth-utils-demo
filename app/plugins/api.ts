// 客製化 $fetch 的 $api 版本
// 檢查token是否過期,則會重新請求token

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
