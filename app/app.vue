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

useHead({
  htmlAttrs: {
    lang: 'zh-Hant',
  },
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Site Title` : 'Site Title'
  },
})

useSeoMeta({
  title: 'My Amazing Site',
  ogTitle: 'My Amazing Site',
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})
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
