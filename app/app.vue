<script setup lang="ts">
const { user, session } = useUserSession()
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <fieldset>
      <legend>User</legend>
      <pre>{{ user }}</pre>
    </fieldset>
    <fieldset>
      <legend>Session</legend>
      <pre>{{ session }}</pre>
    </fieldset>
  </UApp>
</template>
