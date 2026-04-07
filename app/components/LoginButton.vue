<script setup lang="ts">
const route = useRoute()
const { loggedIn } = useUserSession()

const path = computed(() =>
  route.path === '/login'
    ? route.redirectedFrom?.fullPath ||
      route.query.redirectedFrom?.toString() ||
      '/'
    : route.path,
)
</script>

<template>
  <UButton
    v-if="!loggedIn"
    :to="`/login?redirectedFrom=${path}`"
    color="neutral"
    icon="i-lucide-log-in"
    title="login"
    variant="ghost"
  />
</template>
