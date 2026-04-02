<script setup lang="ts">
const route = useRoute()
const { loggedIn } = useUserSession()
</script>

<template>
  <NuxtLink v-if="!loggedIn" :to="`/login?redirectedFrom=${route.path}`">
    Login
  </NuxtLink>
</template>
