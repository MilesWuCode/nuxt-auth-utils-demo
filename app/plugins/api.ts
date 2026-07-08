// 客製化 $fetch 的 $api 版本
// 檢查token是否過期,則會重新請求token

export default defineNuxtPlugin(() => {
  const api = $fetch.create(useAuthFetchOptions())

  return {
    provide: {
      api,
    },
  }
})
