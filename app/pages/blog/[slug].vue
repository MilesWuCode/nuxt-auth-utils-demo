<script setup lang="ts">
const slug = useRoute().params.slug

const data = await queryCollection('blog').path(`/blog/${slug}`).first()
</script>

<template>
  <div>
    <ContentRenderer v-if="data" id="content" :value="data" />
  </div>
</template>
