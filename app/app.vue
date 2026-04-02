<template>
  <UApp>
    <NuxtLoadingIndicator />

    <UHeader>
      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UFooter />
  </UApp>
</template>
