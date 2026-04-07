<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

const { user } = useUserSession()
const { data, refresh } = await useFetch('/api/data')
</script>

<template>
  <UPage>
    <UPageHeader title="Private 2" />

    <UPageBody>
      <UCard>
        <template #header>Me</template>

        <UUser :name="user?.name" :description="user?.email" />
      </UCard>

      <UCard>
        <template #header>
          <div class="flex justify-between">
            Random User
            <UButton
              color="primary"
              variant="outline"
              size="xs"
              @click="refresh()"
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
    </UPageBody>
  </UPage>
</template>
