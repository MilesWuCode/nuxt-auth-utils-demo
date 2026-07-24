// 允許導轉的外站 origin 白名單(給活動頁等外站導轉使用)
export const trustedRedirectOrigins = ['https://www.google.com']

// 驗證redirectedFrom是否可信任:站內相對路徑(非//開頭) 或 白名單origin,其餘一律fallback成'/'
export function sanitizeRedirect(path: string | null | undefined): string {
  if (!path) return '/'

  // 站內相對路徑,但擋//開頭(protocol-relative,會被瀏覽器當成外站網址)
  if (path.startsWith('/') && !path.startsWith('//')) {
    return path
  }

  try {
    const origin = new URL(path).origin

    if (trustedRedirectOrigins.includes(origin)) {
      return path
    }
  } catch {
    // 不是合法的絕對網址
  }

  return '/'
}
