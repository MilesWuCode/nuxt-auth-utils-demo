<script setup lang="ts">
const { $api } = useNuxtApp()

async function onClick() {
  await $api('/api/error', { method: 'POST' })
}
</script>

<template>
  <UButton color="primary" variant="outline" size="xs" @click="onClick">
    Auth Fetch Error
  </UButton>
</template>
