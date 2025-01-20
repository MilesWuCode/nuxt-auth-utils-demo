export function createAccessTokenExpiredAt() {
  // 30秒
  return Date.now() + 30 * 1000;
}

export function createRefreshTokenExpiredAt() {
  // 60秒
  return Date.now() + 60 * 1000;
}
