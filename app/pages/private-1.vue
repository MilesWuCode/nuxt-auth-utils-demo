<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <UPage>
    <UPageHeader title="Private 1" />

    <UPageBody>
      <div class="flex gap-2">
        <RefreshTokenButton />
        <AuthFetchButton />
      </div>

      <UserData />

      <RandomData key="abc" />
      <RandomData key="def" />
    </UPageBody>
  </UPage>
</template>
