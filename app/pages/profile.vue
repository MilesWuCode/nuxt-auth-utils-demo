<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

definePageMeta({
  middleware: ['auth'],
})

const { $api } = useNuxtApp()
const { fetch } = useUserSession()
const authBroadcastChannel = new BroadcastChannel('auth')

const schema = z.object({
  name: z.string('required').nonempty('required'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
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
      <UPageCard class="w-full max-w-md">
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
    </UPageBody>
  </div>
</template>
