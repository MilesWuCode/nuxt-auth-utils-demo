import { getExpiredAt } from '#shared/utils/auth'
import { SignJWT } from 'jose'

// 簽發accessToken/refreshToken(JWT)
// login、google、facebook、apple登入都要用同一套,refreshToken.post.ts才能一律用jwtVerify驗證refreshToken
export async function createTokens(sub: string) {
  const { jwtSecret } = useRuntimeConfig()

  const secret = new TextEncoder().encode(jwtSecret)

  // ! DEMO accessToken故意設10秒就過期，方便測試refresh流程；正式環境請依需求調整(例如15分鐘)
  const accessToken = await new SignJWT({ sub })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10s')
    .sign(secret)

  const refreshToken = await new SignJWT({ sub })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(secret)

  return {
    accessToken,
    accessTokenExpiredAt: getExpiredAt(10),
    refreshToken,
    refreshTokenExpiredAt: getExpiredAt(86400),
  }
}
