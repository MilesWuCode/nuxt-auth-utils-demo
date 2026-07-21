<script setup lang="ts">
const { data } = await useAsyncData('blogs', () =>
  queryCollection('blog').all(),
)
</script>

<template>
  <UPage>
    <UPageHeader title="Blog" />
    <UPageBody>
      <UContainer>
        <UBlogPosts>
          <UBlogPost
            v-for="(post, index) in data"
            :key="index"
            v-bind="post"
            :to="post.path"
          />
        </UBlogPosts>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
