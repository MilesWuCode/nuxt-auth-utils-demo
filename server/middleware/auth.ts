import { isExpired, getExpiredAt, randomString } from '#shared/utils/auth'
import type { UserSession } from '#auth-utils'

/**
 * 型別定義
 */
interface CacheEntry {
  session: UserSession
  expires: number
}

/**
 * 全域狀態管理 (伺服器生命週期內持續存在)
 */
// 1. 正在進行中的 Promise 鎖，防止並行重複執行 (Key: 舊的 refreshToken)
const refreshPromises = new Map<string, Promise<UserSession>>()

// 2. 短期結果快取，防止 SSR 週期內多支 API 重複觸發 (Key: 舊的 refreshToken)
const refreshedCache = new Map<string, CacheEntry>()

// 快取時間：5 秒足以涵蓋單次頁面渲染產生的所有並行請求
const CACHE_TTL = 5000

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const session = await getUserSession(event)

  if(!session.user || !session.token) return

  // 1. 判斷是否需要換件：存在 token 且 accessToken 已過期，但 refreshToken 仍有效
  const shouldRefresh =
    session.token &&
    isExpired(session.token.accessTokenExpiredAt) &&
    !isExpired(session.token.refreshTokenExpiredAt)

  if (!shouldRefresh) {
    // 額外處理：若兩個都過期，主動清除 session
    if (session.token && isExpired(session.token.refreshTokenExpiredAt)) {
      console.info('[Auth] Tokens 均過期，清除 Session')
      await clearUserSession(event)
    }
    return
  }

  const oldRefreshToken = session.token!.refreshToken
  let updatedSession: UserSession | undefined

  /**
   * 2. 執行鎖定與快取策略
   */

  // 策略 A: 優先檢查是否有「剛換好」的快取結果 (防止第一個請求完成後，後續請求仍拿著舊 Cookie 進來)
  const cached = refreshedCache.get(oldRefreshToken)
  if (cached && cached.expires > Date.now()) {
    console.info(`[Auth] [CACHE] ${url.pathname} 使用 5s 內的快取結果`)
    updatedSession = cached.session
    console.log('A',updatedSession?.token.refreshTokenExpiredAt)
  }

  // 策略 B: 檢查是否有「正在換」的並行請求 (等待中的請求會在此攔截)
  else if (refreshPromises.has(oldRefreshToken)) {
    console.info(`[Auth] [WAIT] ${url.pathname} 等待並行請求的換件結果...`)
    updatedSession = await refreshPromises.get(oldRefreshToken)
    console.log('B',updatedSession?.token.refreshTokenExpiredAt)
  }

  // 策略 C: 真的需要執行換件動作 (第一個到達的請求會走這裡)
  else {
    console.info(`[Auth] [LOCK] ${url.pathname} 執行換件鎖定`)

    const refreshTask = (async (): Promise<UserSession> => {
      try {
        // 模擬非同步 API 延遲 (例如：呼叫外部 Auth Provider 換取新 Token)
        await new Promise(resolve => setTimeout(resolve, 3000))

        const newSession: UserSession = {
          ...session,
          token: {
            accessToken: randomString(),
            accessTokenExpiredAt: getExpiredAt(10),
            refreshToken: randomString(),
            refreshTokenExpiredAt: getExpiredAt(30),
          },
        }

        // 成功後寫入快取，供 5 秒內使用相同舊 token 的請求直接拿取
        refreshedCache.set(oldRefreshToken, {
          session: newSession,
          expires: Date.now() + CACHE_TTL
        })

        // 5 秒後自動清理快取，釋放記憶體
        setTimeout(() => refreshedCache.delete(oldRefreshToken), CACHE_TTL)

        return newSession
      } catch (error) {
        console.error(`[Auth] [ERROR] 換件失敗:`, error)
        throw error
      }
    })()

    // 將 Task 放入 Map 鎖定
    refreshPromises.set(oldRefreshToken, refreshTask)

    try {
      updatedSession = await refreshTask
      console.log('C',updatedSession.token.refreshTokenExpiredAt)
    } finally {
      // 任務結束（不論成功失敗）務必移除 Promise 鎖，釋放記憶體
      refreshPromises.delete(oldRefreshToken)
    }
  }

  // 3. 將更新後的 session 套用到目前的 event (讓瀏覽器收到 Set-Cookie 標頭)
  if (updatedSession) {
    console.log('Final',updatedSession.token.refreshTokenExpiredAt)
    await setUserSession(event, updatedSession)
  }
})
