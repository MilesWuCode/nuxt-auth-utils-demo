<template>
  <UApp>
    <NuxtLoadingIndicator />

    <UHeader>
      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <NuxtLayout>
      <UContainer>
        <NuxtPage />
      </UContainer>
    </NuxtLayout>

    <UFooter />
  </UApp>
</template>
