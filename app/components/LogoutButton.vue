<script setup lang="ts">
const { loggedIn, clear } = useUserSession()
</script>

<template>
  <UButton
    v-if="loggedIn"
    color="neutral"
    icon="i-lucide-log-out"
    title="logout"
    variant="ghost"
    @click="clear"
  />
</template>
