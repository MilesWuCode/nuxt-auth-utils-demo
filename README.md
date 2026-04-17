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

- 查看檔案內部解釋功能
  1. app/plugins/01.auth-redirect.client.ts
  2. app/plugins/02.auth-app-mounted.client.ts
  3. app/plugins/03.auth-web-tab.client.ts
  4. app/plugins/04.auth-broadcast.client.ts

- 客製化$fetch及useFetch
  1. app/plugins/api.ts
  2. app/composables/useApi.ts
