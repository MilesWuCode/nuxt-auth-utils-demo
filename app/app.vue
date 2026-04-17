<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[][]>(siteNavigation.menu)

const toaster = {
  position: 'top-right' as const,
}

const route = useRoute()

const open = ref(false)

watch(
  () => route.path,
  () => {
    open.value = false
  },
)
</script>

<template>
  <UApp :toaster="toaster">
    <NuxtLoadingIndicator />

    <UHeader v-model:open="open" title="Nuxt Auth Utils Demo">
      <template #right>
        <UColorModeButton />
        <LoginButton />
        <LogoutButton />
      </template>

      <template #body>
        <UNavigationMenu
          :items="items"
          orientation="vertical"
          class="-mx-2.5"
        />
      </template>
    </UHeader>

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <UFooter />
  </UApp>
</template>
