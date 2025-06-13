<script setup lang="ts">
const { user, session } = useUserSession()
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <CountdownTime />
  <fieldset>
    <legend>User</legend>
    <pre>{{ user }}</pre>
  </fieldset>
  <fieldset>
    <legend>Session</legend>
    <pre>{{ session }}</pre>
  </fieldset>
</template>
