<script setup lang="ts">
/** 頭像預覽網址（裁切後由 File 產生的 blob URL） */
const avatar = ref('')

const openImageCropper = useImageCropper()

/**
 * 釋放目前的 blob URL，避免記憶體洩漏
 * 只處理 blob: 開頭的網址，一般 http 網址不需要也不能 revoke
 */
const revokeAvatar = () => {
  if (avatar.value.startsWith('blob:')) URL.revokeObjectURL(avatar.value)
}

/** 開啟裁切 modal，確認後更新頭像預覽 */
const imageCropperModalOpen = async () => {
  const file = await openImageCropper({
    title: '圖片上傳',
    description: '拖曳移動位置 / 滾輪控制縮放',
    // 已有頭像時帶入，讓使用者可以重新調整（注意：會對已裁切過的圖再裁一次）
    src: avatar.value || undefined,
  })

  // 使用者取消時回傳 undefined，不做任何事
  if (!file) return

  // 先釋放舊的 blob URL，再為新檔案建立預覽網址
  revokeAvatar()
  avatar.value = URL.createObjectURL(file)
}

// 離開頁面時釋放 blob URL
onBeforeUnmount(revokeAvatar)
</script>

<template>
  <div>
    <UPageHeader title="Image Cropper" description="nuxt layers" />

    <UPageBody>
      <div class="space-y-4">
        <!-- 開啟圖片裁切 modal -->
        <UButton
          label="Open Modal"
          class="block"
          @click="imageCropperModalOpen"
        />

        <!-- 裁切後的頭像預覽 -->
        <UAvatar :src="avatar" size="3xl" class="block" />
      </div>
    </UPageBody>
  </div>
</template>
