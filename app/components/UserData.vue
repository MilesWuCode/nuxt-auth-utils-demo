<script setup lang="ts">
const { user, fetch, loggedIn } = useUserSession()

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

    <template #footer>
      <NuxtTime :datetime="user?.fetched_at!" relative class="text-xs" />
    </template>
  </UCard>
</template>
