<script setup lang="ts">
defineProps<{
  prev?: { path: string; title: string } | null
  next?: { path: string; title: string } | null
}>()
</script>

<template>
  <div
    v-if="prev || next"
    class="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 border-t border-default pt-6"
  >
    <NuxtLink
      v-if="prev"
      :to="prev.path"
      class="-my-3 flex min-w-0 flex-col gap-1 rounded-lg p-3 transition-colors hover:bg-elevated"
    >
      <span class="flex items-center gap-1 text-sm text-muted">
        <UIcon name="i-lucide-arrow-left" class="size-4" />
        上一則
      </span>
      <span class="truncate font-medium">{{ prev.title }}</span>
    </NuxtLink>

    <NuxtLink
      v-if="next"
      :to="next.path"
      class="col-start-2 -my-3 flex min-w-0 flex-col gap-1 rounded-lg p-3 text-right transition-colors hover:bg-elevated"
    >
      <span class="flex items-center justify-end gap-1 text-sm text-muted">
        下一則
        <UIcon name="i-lucide-arrow-right" class="size-4" />
      </span>
      <span class="truncate font-medium">{{ next.title }}</span>
    </NuxtLink>
  </div>
</template>
