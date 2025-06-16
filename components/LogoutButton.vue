<script setup lang="ts">
const { loggedIn, clear } = useUserSession()
</script>

<template>
  <a v-if="loggedIn" href="#" @click="clear">Logout</a>
</template>
