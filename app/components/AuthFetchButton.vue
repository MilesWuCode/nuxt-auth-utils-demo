<script setup lang="ts">
const { loggedIn, fetch, session } = useUserSession()
</script>

<template>
  <UButton
    v-if="loggedIn"
    color="primary"
    variant="outline"
    size="xs"
    @click="fetch"
  >
    Auth Fetch
  </UButton>

  <NuxtTime
    :datetime="session?.token.accessTokenExpiredAt!"
    hour="numeric"
    minute="numeric"
    second="numeric"
    class="text-xs"
  />
</template>
