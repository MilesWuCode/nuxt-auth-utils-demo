<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug

const { data } = await useAsyncData(`blog-${slug}`, () =>
  queryCollection('blog').path(`/blog/${slug}`).first(),
)

const backTo = computed(() => ({
  path: '/blog',
  query: route.query.page ? { page: route.query.page } : undefined,
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
          :to="backTo"
          label="Back to blog"
          icon="i-lucide-arrow-left"
          variant="link"
          color="neutral"
          size="sm"
          class="p-0"
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
      </UContainer>
    </UPageBody>
  </UPage>

  <UContainer v-else>
    <UEmpty
      icon="i-lucide-file-question"
      title="Post not found"
      description="The blog post you're looking for doesn't exist."
      :actions="[{ label: 'Back to blog', to: '/blog', color: 'neutral', variant: 'subtle' }]"
      class="py-16"
    />
  </UContainer>
</template>
