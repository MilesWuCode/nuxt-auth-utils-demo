<script setup lang="ts">
definePageMeta({
  middleware: ['guest'],
})

const route = useRoute()

const redirectedFrom =
  route.redirectedFrom?.fullPath ||
  route.query.redirectedFrom?.toString() ||
  '/'

// cookie存返回頁路徑
const redirectedFromCookie = useCookie('redirectedFrom', { maxAge: 3600 })
redirectedFromCookie.value = redirectedFrom

const { fetch } = useUserSession()

const email = ref('user@email.com')
const password = ref('password')

const onClick = async () => {
  await $fetch('/api/login', {
    method: 'POST',
    body: {
      email: email.value,
      password: password.value,
    },
  })
    .then(async () => {
      await fetch()

      await navigateTo(redirectedFrom)
    })
    .catch((err) => {
      console.log(err)

      console.log(err.data?.message || err.message)
    })
}
</script>

<template>
  <div>
    <h1>Login</h1>

    <div style="display: flex">
      <fieldset class="login">
        <legend>Third-party</legend>
        <a href="/auth/apple">Apple</a>
        <a href="/auth/facebook">Facebook</a>
        <a href="/auth/google">Google</a>
      </fieldset>

      <fieldset class="form">
        <legend>Form:</legend>
        <div>
          <span>Email</span>
          <input v-model="email" type="text" name="email" />
        </div>
        <div>
          <span>Password</span>
          <input v-model="password" type="password" name="password" />
        </div>
        <button type="button" @click="onClick">Login</button>
      </fieldset>
    </div>
  </div>
</template>

<style lang="css" scoped>
.login a {
  display: block;
}

.form {
  span {
    display: inline-block;
    width: 100px;
  }
}
</style>
