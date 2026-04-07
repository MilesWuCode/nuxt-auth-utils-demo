<script setup lang="ts">
const route = useRoute()
const { loggedIn } = useUserSession()
</script>

<template>
  <UButton
    v-if="!loggedIn"
    :to="`/login?redirectedFrom=${route.path}`"
    color="neutral"
    icon="i-lucide-log-in"
    title="login"
    variant="ghost"
  />
</template>
