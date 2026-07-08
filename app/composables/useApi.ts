// 客製化 useFetch 的 useApi 版本
// 檢查token是否過期,則會重新請求token

export const useApi = createUseFetch(useAuthFetchOptions())
