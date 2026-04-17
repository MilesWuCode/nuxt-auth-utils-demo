<script setup lang="ts">
const { fetch: authFresh, session } = useUserSession()
const uid = useId()

const { data, refresh } = await useFetch('/api/data', {
  async onRequest() {
    console.log(isExpired(session.value?.token.accessTokenExpiredAt))
    if (isExpired(session.value?.token.accessTokenExpiredAt)) {
      await $fetch('/api/refreshToken', { method: 'POST' })
      await authFresh()
    }
  },
  async onResponseError({ error }) {
    console.log(error)
  },
  key: uid,
})
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex justify-between">
        Random User
        <UButton
          color="primary"
          variant="outline"
          size="xs"
          @click="() => refresh()"
        >
          Refresh
        </UButton>
      </div>
    </template>
    <div class="flex flex-col gap-4">
      <template v-for="item in data" :key="item.id">
        <UUser :name="item?.name" :description="item?.email" />
      </template>
    </div>
  </UCard>
</template>
