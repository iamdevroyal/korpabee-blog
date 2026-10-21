<template>
  <main class="container" style="padding-top: 2rem; padding-bottom: 4rem;">
    <!-- Tag Header -->
    <div style="margin-bottom: 2.25rem;">
      <RouterLink to="/" class="back-link">&larr; Back to All Guides</RouterLink>
      <h1 style="font-size: clamp(1.4rem, 4vw, 2.15rem); font-weight: 800; margin-top: 0.6rem;">
        #{{ route.params.slug }}
      </h1>
      <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.35rem;">
        Articles tagged with #{{ route.params.slug }}.
      </p>
    </div>

    <!-- Posts Grid -->
    <div v-if="loading" style="padding: 4rem 0; text-align: center; color: var(--text-muted); font-size: 0.875rem;">
      Loading articles...
    </div>

    <div v-else-if="!posts.length" style="padding: 4rem 0; text-align: center; color: var(--text-muted); font-size: 0.875rem;">
      No articles found with this tag.
    </div>

    <div v-else class="posts-grid">
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

<style scoped>
.back-link {
  font-size: 0.75rem;
  color: var(--brand-primary-light);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: transform 0.15s ease;
}
.back-link:hover {
  transform: translateX(-2px);
}
</style>
