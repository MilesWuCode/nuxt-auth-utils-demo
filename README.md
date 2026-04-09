# Nuxt Auth Utils Demo

## 情境

- app/composables/useRedirectedFrom.ts
  1. 登入後的返回路徑路徑存到cookies

- app/middleware/01.refresh-token.global.ts
  1. 當換頁時，實作refreshToken功能

- app/middleware/auth.ts
  1. 若SSR和CSR，進入需要登入的頁面，則導向登入頁

- app/middleware/guest.ts
  1. 若SSR和CSR，進入需要訪客的頁面，則導向首頁
  2. 若CSR換頁時，則停止導航
  3. 若CSR換頁時，若從登入頁回到先前訪客專頁，則回到首頁

- app/plugins/02.auth-visibilitychange-event.client.ts
  1. 當SSR，自動抓取用戶資料
  2. 同步用戶資料：當登入中，切換其他分頁，自動抓取用戶資料
  3. 即時登出：當登出時，切換其他分頁，自動抓取用戶資料，若401時自動重新整理頁面

- app/plugins/03.auth-storage-event.client.ts (WIP)
  1. 使用localstorage的監聽事件來通知其他分頁重新整理頁面，即時同步用戶資料和登入登出狀態

- server/middleware/auth.ts
  1. 檢查accessToken和refreshToken是否過期
  2. 若accessToken和refreshToken過期，則清除session
  3. 若accessToken過期，則使用refreshToken換取新的accessToken
