<script setup lang="ts">
useSeoMeta({
  title: 'Index',
})
</script>

<template>
  <div>
    <UPageHeader title="Index" description="this is the index page" />

    <UPageBody>
      <UPageCard
        title="Nuxt Auth Utils Demo"
        description="https://github.com/MilesWuCode/nuxt-auth-utils-demo"
        icon="i-simple-icons-github"
        to="https://github.com/MilesWuCode/nuxt-auth-utils-demo"
        target="_blank"
      />
    </UPageBody>
  </div>
</template>
