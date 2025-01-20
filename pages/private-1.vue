<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const { session, user, clear } = useUserSession();

const callApi = async () => {
  const data = await $fetch("/api/call-api");

  console.log(data);
};
</script>

<template>
  <div>
    Page: private 1

    <button @click="clear">Logout</button>

    <pre>{{ user }}</pre>
    <pre>{{ session }}</pre>

    <button @click="callApi">call api</button>
  </div>
</template>
