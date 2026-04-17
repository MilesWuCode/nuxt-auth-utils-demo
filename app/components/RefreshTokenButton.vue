<script setup lang="ts">
const { loggedIn } = useUserSession()

const onClick = async () => {
  await $fetch('/api/refreshToken', { method: 'POST' })
}
</script>

<template>
  <UButton
    v-if="loggedIn"
    color="primary"
    variant="outline"
    size="xs"
    @click="onClick"
  >
    Refresh Token
  </UButton>
</template>
