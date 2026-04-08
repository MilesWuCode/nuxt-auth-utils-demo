<script setup lang="ts">
definePageMeta({
  middleware: ['guest'],
})
</script>

<template>
  <UPage>
    <UPageHeader title="Guest" description="this is the guest page" />
  </UPage>
</template>
