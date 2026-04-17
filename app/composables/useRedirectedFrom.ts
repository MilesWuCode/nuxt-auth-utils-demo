export function useRedirectedFrom() {
  const route = useRoute()

  // 存入 cookie 以保留 OAuth 流程後的返回路徑
  const redirectedFromCookie = useCookie('redirectedFrom', { maxAge: 3600 })

  const redirectedFrom = computed(() => {
    // 取得返回路徑
    const path =
      route.redirectedFrom?.fullPath ||
      route.query.redirectedFrom?.toString() ||
      '/'

    return path
  })

  // 更新cookie
  watch(redirectedFrom, (val) => {
    redirectedFromCookie.value = val
  })

  return { redirectedFrom }
}
