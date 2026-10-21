<template>
  <main class="container" style="padding-top: 3.5rem;">
    <!-- Tag Header -->
    <div style="margin-bottom: 3rem;">
      <RouterLink to="/" style="font-size: 0.75rem; color: var(--brand-emerald-light); font-weight: 600;">&larr; Back to All Guides</RouterLink>
      <h1 style="font-size: 2.25rem; font-weight: 800; margin-top: 0.75rem;">
        #{{ route.params.slug }}
      </h1>
      <p style="font-size: 0.9375rem; color: var(--text-muted); margin-top: 0.5rem;">
        Articles tagged with #{{ route.params.slug }}.
      </p>
    </div>

    <!-- Posts Grid -->
    <div v-if="loading" style="padding: 4rem 0; text-align: center; color: var(--text-muted);">
      Loading articles...
    </div>

    <div v-else-if="!posts.length" style="padding: 4rem 0; text-align: center; color: var(--text-muted);">
      No articles found with this tag.
    </div>

    <div v-else style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2rem;">
      <ArticleCard
        v-for="post in posts"
        :key="post.uuid"
        :post="post"
      />
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useHead } from 'unhead'
import { blogApi } from '@/api/index.js'
import ArticleCard from '@/components/ArticleCard.vue'

const route = useRoute()
const posts = ref([])
const loading = ref(false)

useHead({
  title: () => `#${route.params.slug} Articles | KorpaBee Blog`
})

async function fetchTagPosts() {
  loading.value = true
  try {
    const res = await blogApi.getPosts({ tag: route.params.slug })
    if (res.data && res.data.data) {
      posts.value = res.data.data
    }
  } catch (err) {
    console.error('Failed to fetch tag posts:', err)
  } finally {
    loading.value = false
  }
}

watch(() => route.params.slug, () => {
  fetchTagPosts()
})

onMounted(() => {
  fetchTagPosts()
})
</script>
