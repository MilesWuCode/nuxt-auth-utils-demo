<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <UPage>
    <UPageHeader title="Private 2" />

    <UPageBody>
      <UserData />

      <RandomData />
    </UPageBody>
  </UPage>
</template>
