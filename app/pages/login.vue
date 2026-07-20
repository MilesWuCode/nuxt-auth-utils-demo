<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import * as z from 'zod'

definePageMeta({
  middleware: ['guest'],
})

useSeoMeta({
  title: 'Login',
})

const { redirectedFrom } = useRedirectedFrom()
const { fetch } = useUserSession()
const authBroadcastChannel = new BroadcastChannel('auth')

// flash 訊息：讀取一次後清除 cookie，不留在網址上
const authErrorCookie = useCookie('authError')
const oauthErrorCode = authErrorCookie.value

// 要等 hydration 完成再清，不然 SSR 輸出跟 client 首次渲染的內容對不上，會出現 hydration mismatch
onMounted(() => {
  authErrorCookie.value = null
})

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
  <div>
    <UPageBody>
      <div class="flex justify-center">
        <UPageCard class="w-full max-w-md">
          <UAlert
            v-if="oauthErrorCode === 'error-0001'"
            color="error"
            variant="subtle"
            title="錯誤"
            description="登入元件發生錯誤，請稍後再試"
            class="mb-4"
          />
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
  </div>
</template>
