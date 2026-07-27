<script setup lang="ts">
defineProps<{
  prev?: { path: string, title: string } | null
  next?: { path: string, title: string } | null
}>()
</script>

<template>
  <div
    v-if="prev || next"
    class="max-w-3xl mx-auto mt-10 grid grid-cols-2 gap-4 border-t border-default pt-6"
  >
    <NuxtLink
      v-if="prev"
      :to="prev.path"
      class="flex flex-col gap-1 rounded-lg p-3 -my-3 min-w-0 hover:bg-elevated transition-colors"
    >
      <span class="flex items-center gap-1 text-sm text-muted">
        <UIcon name="i-lucide-arrow-left" class="size-4" />
        上一則
      </span>
      <span class="font-medium truncate">{{ prev.title }}</span>
    </NuxtLink>

    <NuxtLink
      v-if="next"
      :to="next.path"
      class="flex flex-col gap-1 rounded-lg p-3 -my-3 min-w-0 text-right hover:bg-elevated transition-colors col-start-2"
    >
      <span class="flex items-center justify-end gap-1 text-sm text-muted">
        下一則
        <UIcon name="i-lucide-arrow-right" class="size-4" />
      </span>
      <span class="font-medium truncate">{{ next.title }}</span>
    </NuxtLink>
  </div>
</template>
