<script setup lang="ts">
const route = useRoute()
const limit = 6
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
          v-if="!posts?.length"
          icon="i-lucide-file"
          title="No Blog found"
          description="It looks like you haven't added any blogs. Create one to get started."
        />

        <template v-else>
          <UBlogPosts :ui="{ base: 'lg:gap-y-8' }">
            <UBlogPost
              v-for="(post, index) in posts"
              :key="index"
              v-bind="post"
              :to="{ path: post.path, query: { page: currentPage } }"
            />
          </UBlogPosts>

          <UPagination
            v-model:page="currentPage"
            :total="total || 0"
            :items-per-page="limit"
            :to="to"
            :ui="{ root: 'flex justify-center mt-8' }"
          />
        </template>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
