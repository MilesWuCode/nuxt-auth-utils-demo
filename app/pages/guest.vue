<script setup lang="ts">
definePageMeta({
  middleware: ['guest'],
})

useSeoMeta({
  title: 'Guest',
})
</script>

<template>
  <UPage>
    <UPageHeader title="Guest" description="this is the guest page" />
  </UPage>
</template>
