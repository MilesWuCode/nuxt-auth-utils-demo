<script setup lang="ts">
const toaster = {
  position: 'top-right' as const,
}
</script>

<template>
  <UApp :toaster="toaster">
    <NuxtLoadingIndicator />

    <UHeader>
      <template #right>
        <UColorModeButton />

        <LoginButton />
        <LogoutButton />
      </template>
    </UHeader>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UFooter />
  </UApp>
</template>
