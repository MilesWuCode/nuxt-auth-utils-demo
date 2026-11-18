<script setup lang="ts">
// 配合 useImageCropper
import Cropper from 'cropperjs'

const {
  title = '圖片上傳',
  description = '拖曳移動位置 / 滾輪控制縮放',
  src = '',
  outputWidth = 640,
  outputHeight = 640,
  showGrid = false,
  round = true,
} = defineProps<{
  title?: string
  description?: string
  /** 初始圖片網址（可選） */
  src?: string
  /** 輸出圖片寬度（px），裁切框比例 = outputWidth : outputHeight */
  outputWidth?: number
  /** 輸出圖片高度（px） */
  outputHeight?: number
  /** 是否顯示裁切框輔助線（虛線格線 + 十字準星），預設 false */
  showGrid?: boolean
  /** 裁切框顯示為圓形（長方形時為橢圓；僅影響顯示，輸出仍為矩形圖片），預設 true */
  round?: boolean
}>()

const emit = defineEmits<{
  /** 確認時帶出裁切後的圖片，取消時不帶參數 */
  close: [file?: File]
}>()

/** 裁切框比例（寬 / 高） */
const aspectRatio = outputWidth / outputHeight

/**
 * 自訂 template：
 * - cropper-selection 的 aspect-ratio 依 outputWidth / outputHeight 決定
 * - cropper-selection 不加 movable / resizable / zoomable，也沒有任何 handle → 裁切框固定不動
 * - 移除 action="select" handle → 無法重新拉選取框
 * - 最上層放一個透明的 action="move" handle → 拖曳時移動的是底下的圖片
 * - cropper-image 只開 scalable / translatable → 圖片可移動、放大縮小（滾輪 / 雙指）
 */
const TEMPLATE = `
<cropper-canvas background>
  <cropper-image scalable translatable></cropper-image>
  <cropper-shade></cropper-shade>
  <cropper-selection aspect-ratio="${aspectRatio}">
    <cropper-grid role="grid" bordered covered></cropper-grid>
    <cropper-crosshair centered></cropper-crosshair>
  </cropper-selection>
  <cropper-handle action="move" plain></cropper-handle>
</cropper-canvas>
`

const containerEl = useTemplateRef('container')
const fileEl = useTemplateRef('file')

let cropper: Cropper | null = null
let objectUrl: string | null = null
let fileName = 'image'
/** 載入 / 初始定位圖片期間，暫停「圖片需覆蓋裁切框」的檢查 */
let adjusting = false

const hasImage = ref(false)
const confirming = ref(false)
/** 依 showGrid prop 顯示 / 隱藏裁切框輔助線（cropper-grid + cropper-crosshair） */
const applyGridVisibility = () => {
  cropper?.container
    .querySelectorAll<HTMLElement>('cropper-grid, cropper-crosshair')
    .forEach((el) => {
      el.hidden = !showGrid
    })
}

watch(() => showGrid, applyGridVisibility)

type Rect = { x: number; y: number; width: number; height: number }

const EPSILON = 0.5

/** 圖片範圍是否完整覆蓋裁切框 */
const coversSelection = (image: Rect) => {
  const selection = cropper?.getCropperSelection()
  if (!selection) return true

  return (
    image.x <= selection.x + EPSILON &&
    image.y <= selection.y + EPSILON &&
    image.x + image.width >= selection.x + selection.width - EPSILON &&
    image.y + image.height >= selection.y + selection.height - EPSILON
  )
}

/** 圖片移動 / 縮放時：若會露出裁切框外的空白就拒絕這次變動 */
const onImageChange = (event: Event) => {
  if (adjusting || !(event instanceof CustomEvent)) return
  if (!coversSelection(event.detail as Rect)) event.preventDefault()
}

/** 裁切框：依 outputWidth : outputHeight 比例，放進畫布寬高 70% 的範圍內，置中 */
const layoutSelection = () => {
  const canvas = cropper?.getCropperCanvas()
  const selection = cropper?.getCropperSelection()
  if (!canvas || !selection) return

  const maxWidth = canvas.offsetWidth * 0.7
  const maxHeight = canvas.offsetHeight * 0.7

  let width = maxWidth
  let height = maxWidth / aspectRatio
  if (height > maxHeight) {
    height = maxHeight
    width = maxHeight * aspectRatio
  }

  selection.$change(
    (canvas.offsetWidth - width) / 2,
    (canvas.offsetHeight - height) / 2,
    width,
    height,
  )
}

/** 圖片置中，若不足以覆蓋裁切框則放大到剛好覆蓋 */
const fitImage = () => {
  const canvas = cropper?.getCropperCanvas()
  const image = cropper?.getCropperImage()
  const selection = cropper?.getCropperSelection()
  if (!canvas || !image || !selection) return

  image.$center('contain')

  const rect = image.getBoundingClientRect()
  const ratio = Math.max(
    selection.width / rect.width,
    selection.height / rect.height,
  )
  if (ratio > 1) image.$zoom(ratio - 1)
}

/** 載入圖片：第一次建立 Cropper，之後只更換 cropper-image 的 src */
const loadImage = async (url: string) => {
  if (!containerEl.value) return

  adjusting = true
  try {
    if (!cropper) {
      const image = new Image()
      image.src = url
      image.alt = 'Picture'

      cropper = new Cropper(image, {
        container: containerEl.value,
        template: TEMPLATE,
      })

      cropper.getCropperImage()?.addEventListener('change', onImageChange)
      applyGridVisibility()
    } else {
      const cropperImage = cropper.getCropperImage()
      if (!cropperImage) return
      cropperImage.src = url
    }

    hasImage.value = true
    layoutSelection()

    await cropper.getCropperImage()?.$ready()
    fitImage()
  } finally {
    adjusting = false
  }
}

const revokeObjectUrl = () => {
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl)
    objectUrl = null
  }
}

const openFilePicker = () => {
  fileEl.value?.click()
}

const fileChange = (event: Event) => {
  if (!(event.target instanceof HTMLInputElement)) return

  const file = event.target.files?.item(0)
  // 清空 value，讓同一張圖片可以重複選取
  event.target.value = ''
  if (!file || !file.type.startsWith('image/')) return

  fileName = file.name.replace(/\.[^.]+$/, '') || 'image'
  revokeObjectUrl()
  objectUrl = URL.createObjectURL(file)
  loadImage(objectUrl)
}

/** 將裁切範圍輸出成 outputWidth x outputHeight 的圖片 */
const confirm = async () => {
  const selection = cropper?.getCropperSelection()
  if (!selection) return

  confirming.value = true
  try {
    const canvas = await selection.$toCanvas({
      width: outputWidth,
      height: outputHeight,
    })

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 1)
    })
    if (!blob) return

    emit('close', new File([blob], `${fileName}.jpg`, { type: 'image/jpeg' }))
  } finally {
    confirming.value = false
  }
}

onMounted(() => {
  if (src) loadImage(src)
})

onBeforeUnmount(() => {
  cropper?.getCropperImage()?.removeEventListener('change', onImageChange)
  cropper?.destroy()
  cropper = null
  revokeObjectUrl()
})
</script>

<template>
  <UModal
    :title="title"
    :description="description"
    :dismissible="false"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div
        ref="container"
        class="image-cropper"
        :class="{ 'image-cropper--round': round }"
      >
        <div
          v-if="!hasImage"
          class="flex h-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-default text-muted"
          @click="openFilePicker"
        >
          <UIcon name="i-lucide-image-plus" class="size-8" />
          <span class="text-sm">點擊選擇圖片</span>
        </div>
      </div>
    </template>

    <template #footer>
      <input
        ref="file"
        type="file"
        accept="image/*"
        class="hidden"
        @change="fileChange"
      />

      <UButton
        :label="hasImage ? '更換圖片' : '選擇圖片'"
        color="neutral"
        variant="subtle"
        icon="i-lucide-image"
        @click="openFilePicker"
      />

      <UButton
        label="確認 / 裁切"
        color="neutral"
        variant="outline"
        :disabled="!hasImage"
        :loading="confirming"
        @click="confirm"
      />

      <UButton
        label="取消"
        color="neutral"
        variant="outline"
        @click="emit('close')"
      />
    </template>
  </UModal>
</template>

<style scoped>
/* 正方形畫布，裁切框依比例放在畫布 70% 範圍內 */
.image-cropper {
  width: 100%;
  aspect-ratio: 1 / 1;
}

.image-cropper :deep(cropper-canvas) {
  height: 100%;
}

/*
 * 圓形裁切框（長方形時為橢圓）：
 * - cropper-shade 用 outline 做外圍遮罩，加 border-radius 後遮罩會變成圓形
 * - cropper-grid 加 overflow: hidden，讓格線裁切在圓內
 */
.image-cropper--round :deep(cropper-selection),
.image-cropper--round :deep(cropper-shade),
.image-cropper--round :deep(cropper-grid) {
  border-radius: 50%;
}

.image-cropper--round :deep(cropper-grid) {
  overflow: hidden;
}
</style>
