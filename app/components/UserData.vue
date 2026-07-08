<script setup lang="ts">
const { loggedIn } = useUserSession()

// 沒登入就不要打/api/me,不然401會被useAuthFetchOptions的onResponseError攔截導去/login
const { data, refresh } = await useApi('/api/me', {
  immediate: loggedIn.value,
})
</script>

<template>
  <UCard v-if="loggedIn">
    <template #header>
      <div class="flex justify-between">
        Me

        <UButton
          color="primary"
          variant="outline"
          size="xs"
          @click="() => refresh()"
        >
          Fetch Me
        </UButton>
      </div>
    </template>

    <UUser :name="data?.name" :description="data?.email" />
    <NuxtTime :datetime="data?.fetched_at!" relative class="text-xs" />
  </UCard>
</template>
