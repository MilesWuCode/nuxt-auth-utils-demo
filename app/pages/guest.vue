<script setup lang="ts">
definePageMeta({
  middleware: ['guest'],
})

useSeoMeta({
  title: 'Guest',
})
</script>

<template>
  <div>
    <UPageHeader title="Guest" description="this is the guest page" />
  </div>
</template>
