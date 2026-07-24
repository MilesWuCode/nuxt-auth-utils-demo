<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod'

definePageMeta({
  middleware: ['auth'],
})

useSeoMeta({
  title: 'Profile',
})

const { session } = useUserSession()
const { $api } = useNuxtApp()
const authBroadcastChannel = useAuthBroadcastChannel()

const schema = z.object({
  name: z.string('required').nonempty('required'),
})

type Schema = z.output<typeof schema>

const { data } = await useApi('/api/me')

const state = reactive<Partial<Schema>>({
  name: data.value?.name,
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await $api('/api/profile', {
    method: 'POST',
    body: event.data,
  })
    .then(async () => {
      toast.add({
        title: 'Profile updated',
        color: 'success',
      })

      authBroadcastChannel.postMessage({ action: 'fetch-user' })
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>

<template>
  <div>
    <UPageHeader title="Profile" />

    <UPageBody>
      <UPageCard title="Change Name">
        <UForm
          :schema="schema"
          :state="state"
          class="w-full space-y-4"
          @submit="onSubmit"
        >
          <UFormField label="name" name="name" required>
            <UInput v-model="state.name" class="w-full" />
          </UFormField>

          <UButton type="submit">Submit</UButton>
        </UForm>
      </UPageCard>

      <UPageCard title="Session">
        <pre class="text-xs wrap-break-word">{{
          JSON.stringify(session, null, 2)
        }}</pre>
      </UPageCard>
    </UPageBody>
  </div>
</template>
