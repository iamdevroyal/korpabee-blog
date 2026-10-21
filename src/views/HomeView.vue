<template>
  <div style="width: 100%; max-width: 100%; overflow-x: hidden;">
    <!-- Hero Spotlight Section -->
    <section v-if="featuredPost" class="hero-spotlight">
      <div class="container">
        <div class="hero-grid">
          <!-- Featured Image -->
          <div class="hero-image-wrap">
            <RouterLink :to="`/posts/${featuredPost.slug}`" class="hero-link">
              <img
                :src="featuredPost.featured_image_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200'"
                :alt="featuredPost.title"
                class="hero-img"
              />
            </RouterLink>
          </div>

          <!-- Featured Info -->
          <div class="hero-info">
            <span
              v-if="featuredPost.category"
              class="hero-badge"
              :style="{ backgroundColor: featuredPost.category.color_hex || '#059669' }"
            >
              {{ featuredPost.category.name }}
            </span>
            <h1 class="hero-title">
              <RouterLink :to="`/posts/${featuredPost.slug}`" class="hero-title-link">
                {{ featuredPost.title }}
              </RouterLink>
            </h1>
            <p class="hero-summary">
              {{ featuredPost.summary }}
            </p>
            <div class="hero-actions">
              <RouterLink
                :to="`/posts/${featuredPost.slug}`"
                class="btn-emerald"
                style="padding: 0.6rem 1.25rem; font-size: 0.84375rem;"
              >
                Read Full Story &rarr;
              </RouterLink>
              <span class="hero-read-time">
                {{ featuredPost.read_time_minutes || 3 }} min read
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content Section: Grid & Filters -->
    <main class="container" style="padding-top: 2rem; padding-bottom: 4rem;">
      <!-- Category Filter Pills & Search Bar -->
      <div class="category-filter-bar">
        <div class="category-pills-wrap">
          <button
            type="button"
            @click="setCategory('')"
            class="category-pill"
            :class="{ active: !activeCategory }"
          >
            All Guides
          </button>
          <button
            v-for="cat in categories"
            :key="cat.slug"
            type="button"
            @click="setCategory(cat.slug)"
            class="category-pill"
            :class="{ active: activeCategory === cat.slug }"
          >
            {{ cat.name }}
          </button>
        </div>

        <!-- Search Bar -->
        <div class="search-input-wrap">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            v-model="search"
            @input="debounceSearch"
            type="text"
            placeholder="Search verified guides..."
            class="search-input"
          />
        </div>
      </div>

      <!-- Articles Grid -->
      <div v-if="loading" style="padding: 4rem 0; text-align: center; color: var(--text-muted); font-size: 0.875rem;">
        Loading verified guides...
      </div>

      <div v-else-if="!posts.length" style="padding: 4rem 0; text-align: center; color: var(--text-muted); font-size: 0.875rem;">
        No articles found matching your criteria.
      </div>

      <div v-else class="posts-grid">
        <ArticleCard
          v-for="post in posts"
          :key="post.uuid"
          :post="post"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useHead } from 'unhead'
import { blogApi } from '@/api/index.js'
import ArticleCard from '@/components/ArticleCard.vue'

useHead({
  title: 'KorpaBee Blog — Verified NYSC News, Guides, and Survival Tips',
  meta: [
    { name: 'description', content: 'Authoritative resource for Nigerian Prospective Corps Members and active Corpers.' }
  ]
})

const posts = ref([])
const categories = ref([])
const featuredPost = ref(null)
const activeCategory = ref('')
const search = ref('')
const loading = ref(false)

let timer = null

function debounceSearch() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    fetchPosts()
  }, 350)
}

function setCategory(slug) {
  activeCategory.value = slug
  fetchPosts()
}

async function fetchPosts() {
  loading.value = true
  try {
    const params = {
      category: activeCategory.value || undefined,
      search: search.value || undefined,
    }
    const res = await blogApi.getPosts(params)
    if (res.data && res.data.data) {
      posts.value = res.data.data
      if (!featuredPost.value && posts.value.length > 0) {
        featuredPost.value = posts.value[0]
      }
    }
  } catch (err) {
    console.error('Failed to fetch posts:', err)
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    const res = await blogApi.getCategories()
    if (res.data && res.data.data) {
      categories.value = res.data.data
    }
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
}

onMounted(() => {
  fetchPosts()
  fetchCategories()
})
</script>

<style scoped>
.hero-spotlight {
  background: linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, transparent 100%);
  padding: 2rem 0 1.5rem;
  border-bottom: 1px solid var(--border-subtle);
}

@media (min-width: 768px) {
  .hero-spotlight {
    padding: 3rem 0 2.5rem;
  }
}

.hero-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
    align-items: center;
  }
}

.hero-image-wrap {
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 16 / 10;
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  background: var(--bg-surface-elevated);
}

.hero-link {
  display: block;
  width: 100%;
  height: 100%;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.hero-image-wrap:hover .hero-img {
  transform: scale(1.02);
}

.hero-info {
  display: flex;
  flex-direction: column;
}

.hero-badge {
  align-self: flex-start;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #fff;
  margin-bottom: 0.75rem;
  letter-spacing: 0.04em;
}

.hero-title {
  font-size: clamp(1.35rem, 3.5vw, 2.15rem);
  font-weight: 800;
  line-height: 1.25;
  margin-bottom: 0.85rem;
}

.hero-title-link {
  color: #ffffff;
  transition: color 0.15s;
}

.hero-title-link:hover {
  color: var(--brand-emerald-light);
}

.hero-summary {
  font-size: 0.9125rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 1.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.hero-read-time {
  font-size: 0.78125rem;
  color: var(--text-subtle);
}
</style>
