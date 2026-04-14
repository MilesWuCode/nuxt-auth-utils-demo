<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <UPage>
    <UPageHeader title="Private 1" />

    <UPageBody>
      <UserData />

      <RandomData />
    </UPageBody>
  </UPage>
</template>
