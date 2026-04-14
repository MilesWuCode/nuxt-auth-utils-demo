export function isExpired(timestamp: number = 0) {
  return timestamp < Date.now()
}

export function getExpiredAt(seconds: number = 7 * 86400) {
  return Date.now() + seconds * 1000
}

export function randomString(len: number = 128) {
  return [...Array(len)].map(() => Math.random().toString(36)[2]).join('')
}
