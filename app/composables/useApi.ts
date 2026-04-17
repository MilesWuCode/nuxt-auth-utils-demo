// 客製化$fetch及useFetch

export const useApi = createUseFetch({
  async onRequest() {
    const { session, fetch } = useUserSession()

    if (isExpired(session.value?.token.accessTokenExpiredAt)) {
      await $fetch('/api/refreshToken', { method: 'POST' })
      await fetch()
    }
  },
  async onResponseError({ response }) {
    if (response.status === 401) {
      await navigateTo('/login')
    }
  },
})
