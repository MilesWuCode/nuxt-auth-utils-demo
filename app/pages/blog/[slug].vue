<script setup lang="ts">
const router = useRouter()
const slug = useRoute().params.slug

const { data } = await useAsyncData(`blog-${slug}`, () =>
  queryCollection('blog').path(`/blog/${slug}`).first(),
)

const { data: surround } = await useAsyncData(`blog-surround-${slug}`, () =>
  queryCollectionItemSurroundings('blog', `/blog/${slug}`).order('date', 'DESC'),
)

const prevPost = computed(() => surround.value?.[0] ?? null)
const nextPost = computed(() => surround.value?.[1] ?? null)

function goBack() {
  if (import.meta.client && window.history.state?.back) {
    const url = new URL(window.history.state.back, window.location.origin)

    if (url.pathname === '/blog') {
      router.back()
    } else {
      router.push('/blog')
    }
  } else {
    router.push('/blog')
  }
}

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
          @click="goBack"
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
