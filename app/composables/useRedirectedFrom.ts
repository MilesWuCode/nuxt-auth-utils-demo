export function useRedirectedFrom() {
  const route = useRoute()

  // 存入 cookie 以保留 OAuth 流程後的返回路徑
  const redirectedFromCookie = useCookie('redirectedFrom', { maxAge: 600 })

  const redirectedFrom = computed(() => {
    // 解釋
    // route.redirectedFrom?.fullPath 轉入現在位置前(redirectedFrom)的完整(fullPath)路徑
    // route.query.redirectedFrom 路由query的redirectedFrom

    // 取得返回路徑
    const path =
      route.redirectedFrom?.fullPath ||
      route.query.redirectedFrom?.toString() ||
      '/'

    // 過濾掉非站內路徑/非白名單origin,避免open redirect
    return sanitizeRedirect(path)
  })

  // 更新cookie(immediate:true,不然剛進頁面時的初始值不會被寫入)
  watch(
    redirectedFrom,
    (val) => {
      redirectedFromCookie.value = val
    },
    { immediate: true },
  )

  return { redirectedFrom }
}
