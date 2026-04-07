<template>
  <UApp>
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
