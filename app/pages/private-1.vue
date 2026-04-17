<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

useSeoMeta({
  title: 'Private 1',
})
</script>

<template>
  <div>
    <UPageHeader title="Private 1" />

    <UPageBody>
      <div class="flex gap-2">
        <RefreshTokenButton />
        <AuthFetchButton />
      </div>

      <UserData />

      <RandomData v-for="i of 3" :key="i" />
    </UPageBody>
  </div>
</template>
