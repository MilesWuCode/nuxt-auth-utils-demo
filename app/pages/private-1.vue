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
    <UPageHeader title="Private 1" description="useApi" />

    <UPageBody>
      <div class="flex gap-2">
        <RefreshTokenButton />
        <AuthFetchButton />
        <AuthFetchErrorButton />
      </div>

      <UserData />

      <RandomDataCustom v-for="i of 3" :key="i" />
    </UPageBody>
  </div>
</template>
