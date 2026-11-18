import { LazyImageCropper } from '#components'

export interface ImageCropperOptions {
  title?: string
  description?: string
  /** 初始圖片網址 */
  src?: string
  /** 輸出圖片寬度（px），裁切框比例 = outputWidth : outputHeight */
  outputWidth?: number
  /** 輸出圖片高度（px） */
  outputHeight?: number
  /** 是否顯示裁切框輔助線（虛線格線 + 十字準星） */
  showGrid?: boolean
  /** 裁切框顯示為圓形（長方形時為橢圓） */
  round?: boolean
}

/**
 * 開啟圖片裁切 modal
 *
 * @example
 * const openImageCropper = useImageCropper()
 *
 * const open = async () => {
 *   const file = await openImageCropper({
 *     title: '圖片上傳',
 *     description: '拖曳移動位置 / 滾輪控制縮放',
 *   })
 *
 *   if (!file) return
 *
 *   console.log(file)
 * }
 *
 * @returns 確認時回傳裁切後的 File，取消時回傳 undefined
 */
export const useImageCropper = () => {
  const overlay = useOverlay()

  return (options: ImageCropperOptions = {}): Promise<File | undefined> => {
    const modal = overlay.create(LazyImageCropper, {
      destroyOnClose: true,
      props: options,
    })

    return modal.open()
  }
}
