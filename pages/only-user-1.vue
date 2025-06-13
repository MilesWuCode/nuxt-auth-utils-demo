<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

const { data } = await useFetch('/api/data')
</script>

<template>
  <div>
    <h1>Only User 1</h1>

    <fieldset>
      <legend>Data</legend>
      <pre>{{ data }}</pre>
    </fieldset>
  </div>
</template>
