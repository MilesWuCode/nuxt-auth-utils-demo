<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField, ButtonProps } from '@nuxt/ui'
import { FetchError } from 'ofetch'
import * as z from 'zod'

definePageMeta({
  middleware: ['guest'],
})

useSeoMeta({
  title: 'Login',
})

const { redirectedFrom } = useRedirectedFrom()
const { fetch } = useUserSession()
const authBroadcastChannel = useAuthBroadcastChannel()

// flash message
const oauthErrorCookie = useCookie('OAuthError')

const message = ref('')
const form = useTemplateRef('form')
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')

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

const providers = ref<ButtonProps[]>([
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
])

const schema = z.object({
  email: z.email('Invalid email'),
  password: z
    .string('Password is required')
    .min(8, 'Must be at least 8 characters'),
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  console.log('Submitted', payload)

  status.value = 'loading'

  // wip
  $fetch('/api/login', {
    method: 'POST',
    body: {
      email: payload.data.email,
      password: payload.data.password,
    },
  })
    .then(async () => {
      await fetch()

      authBroadcastChannel.postMessage({ action: 'login' })

      await navigateTo(redirectedFrom.value, {
        external: !redirectedFrom.value.startsWith('/'),
      })
    })
    .catch((error) => {
      if (error instanceof FetchError) {
        // 欄位
        if (error.status === 422) {
          const errors = error.data?.data?.fieldErrors ?? {}

          form.value?.formRef?.setErrors(
            Object.entries(errors).flatMap(([key, messages]) => {
              if (!Array.isArray(messages) || typeof messages[0] !== 'string') {
                return []
              }

              return [{ name: key, message: messages[0] }]
            }),
          )

          return
        }

        switch (error.status) {
          case 400:
          case 401:
            message.value = error.data?.message ?? '伺服器錯誤，請稍後再試'
            break
          default:
            message.value = '伺服器錯誤，請稍後再試'
        }

        status.value = 'error'
      }
    })
}
</script>

<template>
  <div>
    <UPageBody>
      <div class="flex justify-center">
        <UPageCard class="w-full max-w-md">
          <UAlert
            v-if="oauthErrorCookie"
            color="error"
            variant="subtle"
            title="錯誤"
            :description="oauthErrorCookie"
            class="mb-4"
          />
          <UAuthForm
            ref="form"
            title="Login"
            :fields="fields"
            :providers="providers"
            :schema="schema"
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
  </div>
</template>
