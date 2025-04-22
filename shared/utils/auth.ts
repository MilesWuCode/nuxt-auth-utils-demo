export function isExpired(sec: number) {
  return sec < Date.now();
}

export function getExpiredAt(second: number = 7 * 24 * 3600) {
  return Date.now() + second * 1000;
}

export function randomString(len: number = 128) {
  return [...Array(len)].map(() => Math.random().toString(36)[2]).join("");
}
