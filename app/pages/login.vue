<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

definePageMeta({
  middleware: ['guest'],
})

const { redirectedFrom } = useRedirectedFrom()
const { fetch } = useUserSession()
const authBroadcastChannel = new BroadcastChannel('auth')

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
    defaultValue: 'user@email.com',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true,
    defaultValue: 'password',
  },
  // {
  //   name: 'remember',
  //   label: 'Remember me',
  //   type: 'checkbox',
  // },
]

const origin = useRequestURL().origin

const providers = [
  {
    label: 'Apple',
    icon: 'i-simple-icons-apple',
    to: `${origin}/auth/apple`,
  },
  {
    label: 'Facebook',
    icon: 'i-simple-icons-facebook',
    to: `${origin}/auth/facebook`,
  },
  {
    label: 'Google',
    icon: 'i-simple-icons-google',
    to: `${origin}/auth/google`,
  },
]

const schema = z.object({
  email: z.email('Invalid email'),
  password: z
    .string('Password is required')
    .min(8, 'Must be at least 8 characters'),
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  console.log('Submitted', payload)

  await $fetch('/api/login', {
    method: 'POST',
    body: {
      email: payload.data.email,
      password: payload.data.password,
    },
  })
    .then(async () => {
      await fetch()

      authBroadcastChannel.postMessage({ action: 'login' })

      await navigateTo(redirectedFrom.value)
    })
    .catch((err) => {
      console.log(err)

      console.log(err.data?.message || err.message)
    })
}
</script>

<template>
  <UPage>
    <UPageBody>
      <div class="flex justify-center">
        <UPageCard class="w-full max-w-md">
          <UAuthForm
            :schema="schema"
            title="Login"
            :fields="fields"
            :providers="providers"
            @submit="onSubmit"
          />
          <UAlert
            title="Redirected From"
            variant="subtle"
            :description="redirectedFrom"
          />
        </UPageCard>
      </div>
    </UPageBody>
  </UPage>
</template>
