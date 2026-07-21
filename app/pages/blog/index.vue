<script setup lang="ts">
const route = useRoute()
const limit = 1
const currentPage = computed(() => parseInt(route.query.page as string) || 1)

const { data: total } = await useAsyncData('blog-count', () => {
  return queryCollection('blog').count()
})

const { data: posts } = await useAsyncData(
  `blogs-${currentPage.value}`,
  () => {
    return queryCollection('blog')
      .order('date', 'DESC') // 通常會按日期排序
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
        <UBlogPosts>
          <UBlogPost
            v-for="(post, index) in posts"
            :key="index"
            v-bind="post"
            :to="post.path"
          />
        </UBlogPosts>
      </UContainer>
      <UPagination
        v-model:page="currentPage"
        :total="total || 0"
        :items-per-page="limit"
        :to="to"
        class="flex justify-center"
      />
    </UPageBody>
  </UPage>
</template>
