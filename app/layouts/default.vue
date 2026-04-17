<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[][]>(siteNavigation.menu)
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UPageAside>
          <UNavigationMenu orientation="vertical" :items="items" />
        </UPageAside>
      </template>

      <slot />
    </UPage>
  </UContainer>
</template>
