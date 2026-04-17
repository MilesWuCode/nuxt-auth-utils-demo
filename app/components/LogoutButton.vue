<script setup lang="ts">
const { loggedIn, clear, user } = useUserSession()

const authBroadcastChannel = new BroadcastChannel('auth')

const onClick = async () => {
  await clear()

  authBroadcastChannel.postMessage({ action: 'logout' })
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
