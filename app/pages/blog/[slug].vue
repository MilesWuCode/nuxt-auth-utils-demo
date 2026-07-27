<script setup lang="ts">
const slug = useRoute().params.slug
const pageSize = useAppConfig().blog.pageSize

const { data } = await useAsyncData(`blog-${slug}`, () =>
  queryCollection('blog').path(`/blog/${slug}`).first(),
)

const { data: surround } = await useAsyncData(`blog-surround-${slug}`, () =>
  queryCollectionItemSurroundings('blog', `/blog/${slug}`).order(
    'date',
    'DESC',
  ),
)

const prevPost = computed(() => surround.value?.[0] ?? null)
const nextPost = computed(() => surround.value?.[1] ?? null)

const { data: postsBefore } = await useAsyncData(
  `blog-position-${slug}`,
  () => {
    if (!data.value?.date) return Promise.resolve(0)
    return queryCollection('blog').where('date', '>', data.value.date).count()
  },
)

const listPage = computed(() =>
  postsBefore.value ? Math.floor(postsBefore.value / pageSize) + 1 : 1,
)

const backToBlog = computed(() => ({
  path: '/blog',
  query: { page: listPage.value > 1 ? listPage.value : undefined },
}))

const formattedDate = computed(() => {
  if (!data.value?.date) return null
  return new Date(data.value.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>

<template>
  <UPage v-if="data">
    <UPageHeader :title="data.title" :description="data.description">
      <template #headline>
        <UButton
          label="Back to blog"
          icon="i-lucide-arrow-left"
          variant="link"
          color="neutral"
          size="sm"
          class="p-0"
          :to="backToBlog"
        />
      </template>

      <div class="flex flex-wrap items-center gap-3 text-sm text-muted">
        <time v-if="formattedDate">{{ formattedDate }}</time>
        <UBadge
          v-for="tag in data.tags"
          :key="tag"
          :label="tag"
          variant="subtle"
          color="neutral"
        />
      </div>
    </UPageHeader>

    <UPageBody>
      <UContainer>
        <ContentRenderer id="content" :value="data" class="max-w-3xl mx-auto" />

        <BlogPostSurroundings :prev="prevPost" :next="nextPost" />
      </UContainer>
    </UPageBody>
  </UPage>

  <UContainer v-else>
    <UEmpty
      icon="i-lucide-file-question"
      title="Post not found"
      description="The blog post you're looking for doesn't exist."
      :actions="[
        {
          label: 'Back to blog',
          to: '/blog',
          color: 'neutral',
          variant: 'subtle',
        },
      ]"
      class="py-16"
    />
  </UContainer>
</template>
