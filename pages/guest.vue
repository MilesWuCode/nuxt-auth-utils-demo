<script setup lang="ts">
definePageMeta({
  middleware: ["guest"],
});

const callApi = async () => {
  const data = await $fetch("/api/call-api");

  console.log(data);
};
</script>

<template>
  <div>
    <div>Page: Guest</div>

    <button @click="callApi">call api</button>
  </div>
</template>
