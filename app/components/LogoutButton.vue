<script setup lang="ts">
const { loggedIn, clear, user } = useUserSession()

const onClick = async () => {
  await clear()
  localStorage.setItem('user-auth-status', 'logout')
}
</script>

<template>
  <UAvatar v-if="loggedIn" :alt="user?.name" />
  <UButton
    v-if="loggedIn"
    color="neutral"
    icon="i-lucide-log-out"
    title="logout"
    variant="ghost"
    @click="onClick"
  />
</template>
