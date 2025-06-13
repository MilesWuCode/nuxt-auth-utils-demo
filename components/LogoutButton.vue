<script setup lang="ts">
const { loggedIn, clear } = useUserSession()
</script>

<template>
  <button v-if="loggedIn" @click="clear">Logout</button>
</template>

<style lang="css" scoped>
button {
  align-self: baseline;
}
</style>
