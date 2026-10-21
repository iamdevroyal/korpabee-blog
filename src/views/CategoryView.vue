<template>
  <main class="container" style="padding-top: 2rem; padding-bottom: 4rem;">
    <!-- Category Header -->
    <div style="margin-bottom: 2.25rem;">
      <RouterLink to="/" class="back-link">&larr; Back to All Guides</RouterLink>
      <h1 style="font-size: clamp(1.4rem, 4vw, 2.15rem); font-weight: 800; margin-top: 0.6rem; text-transform: capitalize;">
        {{ currentCategoryName }}
      </h1>
      <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.35rem;">
        Comprehensive verified guides and updates filed under this category.
      </p>
    </div>

    <!-- Posts Grid -->
    <div v-if="loading" style="padding: 4rem 0; text-align: center; color: var(--text-muted); font-size: 0.875rem;">
      Loading articles...
    </div>

    <div v-else-if="!posts.length" style="padding: 4rem 0; text-align: center; color: var(--text-muted); font-size: 0.875rem;">
      No articles found in this category.
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useHead } from 'unhead'
import { blogApi } from '@/api/index.js'
import ArticleCard from '@/components/ArticleCard.vue'

const route = useRoute()
const posts = ref([])
const loading = ref(false)

const currentCategoryName = computed(() => {
  const slug = route.params.slug || ''
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
})

useHead({
  title: computed(() => `${currentCategoryName.value} Guides & News | KorpaBee Blog`)
})

async function fetchCategoryPosts() {
  loading.value = true
  try {
    const res = await blogApi.getPosts({ category: route.params.slug })
    if (res.data && res.data.data) {
      posts.value = res.data.data
    }
  } catch (err) {
    console.error('Failed to fetch category posts:', err)
  } finally {
    loading.value = false
  }
}

watch(() => route.params.slug, () => {
  fetchCategoryPosts()
})

onMounted(() => {
  fetchCategoryPosts()
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
