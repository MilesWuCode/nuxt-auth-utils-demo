export function isExpired(sec: number) {
  return sec < Date.now();
}
