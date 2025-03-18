export function randomString(len: number) {
  return [...Array(len)].map(() => Math.random().toString(36)[2]).join("");
}

export function createAccessTokenExpiredAt() {
  // 30秒
  // return Date.now() + 30 * 1000;

  // 1小時
  return Date.now() + 3600 * 1000;
}

export function createRefreshTokenExpiredAt() {
  // 60秒
  // return Date.now() + 60 * 1000;

  // 2小時
  return Date.now() + 2 * 3600 * 1000;
}
