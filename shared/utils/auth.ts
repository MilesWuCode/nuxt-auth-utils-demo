export function isExpired(timestamp: number = 0) {
  return timestamp < Date.now()
}

export function getExpiredAt(seconds: number = 7 * 86400) {
  return Date.now() + seconds * 1000
}
