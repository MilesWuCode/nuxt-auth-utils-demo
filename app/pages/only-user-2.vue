<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

const { data, refresh } = await useFetch('/api/data')
</script>

<template>
  <div>
    <h1>Only User 2</h1>

    <fieldset>
      <legend>Data</legend>
      <button type="button" @click="() => refresh()">Refresh</button>
      <pre>{{ data }}</pre>
    </fieldset>
  </div>
</template>
