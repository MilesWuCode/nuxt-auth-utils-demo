<script setup lang="ts">
const { user, fetch, loggedIn,session } = useUserSession()

const fetchMe = async () => {
  await $fetch('/api/me').then(fetch)
}
</script>

<template>
  <UCard v-if="loggedIn">
    <template #header>
      <div class="flex justify-between">
        Me

        <UButton color="primary" variant="outline" size="xs" @click="fetchMe">
          Fetch Me
        </UButton>
      </div>
    </template>

    <UUser :name="user?.name" :description="user?.email" />
    <NuxtTime :datetime="session?.token.refreshTokenExpiredAt!" relative class="text-xs" />
  </UCard>
</template>
