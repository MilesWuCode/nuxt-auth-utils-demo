<script setup lang="ts">
const route = useRoute()
const limit = 1
const currentPage = computed(() => parseInt(route.query.page as string) || 1)

const { data: total } = await useAsyncData('blog-count', () => {
  return queryCollection('blog').count()
})

const { data: posts } = await useAsyncData(
  `blog-list-${currentPage.value}`,
  () => {
    return queryCollection('blog')
      .order('date', 'DESC')
      .limit(limit)
      .skip((currentPage.value - 1) * limit)
      .all()
  },
  {
    watch: [currentPage],
  },
)

function to(page: number) {
  return {
    query: {
      page,
    },
  }
}
</script>

<template>
  <UPage>
    <UPageHeader title="Blog" />
    <UPageBody>
      <UContainer>
        <UEmpty
          icon="i-lucide-file"
          title="No Blog found"
          description="It looks like you haven't added any blogs. Create one to get started."
        />

        <UBlogPosts>
          <UBlogPost
            v-for="(post, index) in posts"
            :key="index"
            v-bind="post"
            :to="post.path"
          />
        </UBlogPosts>

        <UPagination
          v-model:page="currentPage"
          :total="total || 0"
          :items-per-page="limit"
          :to="to"
          class="flex justify-center"
        />
      </UContainer>
    </UPageBody>
  </UPage>
</template>
