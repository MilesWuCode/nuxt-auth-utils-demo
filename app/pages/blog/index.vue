<script setup lang="ts">
const limit = useAppConfig().blog.pageSize
const page = useRouteQuery('page', '1', { transform: Number })

const { data: total } = await useAsyncData('blog-count', () => {
  return queryCollection('blog').count()
})

const { data: posts } = await useAsyncData(
  `blog-list-${page.value}`,
  () => {
    return queryCollection('blog')
      .order('date', 'DESC')
      .limit(limit)
      .skip((page.value - 1) * limit)
      .all()
  },
  {
    watch: [page],
  },
)
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
              :to="post.path"
            />
          </UBlogPosts>

          <UPagination
            v-model:page="page"
            :total="total || 0"
            :items-per-page="limit"
            :ui="{ root: 'flex justify-center mt-8' }"
          />
        </template>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
