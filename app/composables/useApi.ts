// 客製化 useFetch 的 useApi 版本
// 檢查token是否過期,則會重新請求token

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
