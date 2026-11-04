// 客製化 useFetch 的 useApi 版本
// 檢查token是否過期,則會重新請求token
// useApi 主要是為了處理一個情況：使用者一直停在同一頁、沒有換頁，access token 就過期了。

export const useApi = createUseFetch(useAuthFetchOptions())
