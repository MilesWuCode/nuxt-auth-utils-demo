<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Pages',
      icon: 'i-lucide-box',
      defaultOpen: true,
      children: [
        {
          label: 'Index',
          icon: 'i-lucide-house',
          to: '/',
        },
        {
          label: 'Public',
          icon: 'i-lucide-house',
          to: '/public',
        },
        {
          label: 'Guest',
          icon: 'i-lucide-house',
          to: '/guest',
        },
      ],
    },
    {
      label: 'Auth',
      icon: 'i-lucide-box',
      defaultOpen: true,
      children: [
        {
          label: 'Login',
          icon: 'i-lucide-house',
          to: '/login',
        },
        {
          label: 'Login 2',
          icon: 'i-lucide-house',
          to: '/login-2',
        },
        {
          label: 'Private 1',
          icon: 'i-lucide-house',
          to: '/private-1',
        },
        {
          label: 'Private 2',
          icon: 'i-lucide-house',
          to: '/private-2',
        },
      ],
    },
  ],
])
</script>

<template>
  <UContainer class="flex gap-4">
    <UNavigationMenu
      orientation="vertical"
      :items="items"
      class="data-[orientation=vertical]:w-60"
    />
    <div class="flex-1">
      <slot />
    </div>
  </UContainer>
</template>
