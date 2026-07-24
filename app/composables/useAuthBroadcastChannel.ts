// 全站共用同一個 BroadcastChannel 實例
// 若各處各自 new BroadcastChannel('auth'),同一分頁內的傳送方跟接收方會是不同物件,
// 導致本分頁也會收到自己發出的訊息(瀏覽器只保證同一個物件不會收到自己送出的訊息)

let channel: BroadcastChannel | undefined

export function useAuthBroadcastChannel() {
  if (!channel) {
    channel = new BroadcastChannel('auth')
  }

  return channel
}
