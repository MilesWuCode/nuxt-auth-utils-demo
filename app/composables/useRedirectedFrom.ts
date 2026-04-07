export function useRedirectedFrom() {
  const route = useRoute()

  const redirectedFrom =
    route.redirectedFrom?.fullPath ||
    route.query.redirectedFrom?.toString() ||
    '/'

  // 存入 cookie 以保留 OAuth 流程後的返回路徑
  const redirectedFromCookie = useCookie('redirectedFrom', { maxAge: 3600 })
  redirectedFromCookie.value = redirectedFrom

  return { redirectedFrom }
}
