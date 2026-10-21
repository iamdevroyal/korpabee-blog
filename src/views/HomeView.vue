<template>
  <div>
    <!-- Hero Spotlight Section -->
    <section v-if="featuredPost" style="background: linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, transparent 100%); padding: 3rem 0 2rem;">
      <div class="container">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem; align-items: center;">
          <!-- Featured Image -->
          <div style="border-radius: var(--radius-lg); overflow: hidden; aspect-ratio: 16/10; border: 1px solid var(--border-color); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <RouterLink :to="`/posts/${featuredPost.slug}`">
              <img
                :src="featuredPost.featured_image_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200'"
                :alt="featuredPost.title"
                style="width: 100%; height: 100%; object-fit: cover;"
              />
            </RouterLink>
          </div>

          <!-- Featured Info -->
          <div>
            <span
              v-if="featuredPost.category"
              style="display: inline-block; padding: 0.3rem 0.8rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #fff; margin-bottom: 1rem;"
              :style="{ backgroundColor: featuredPost.category.color_hex || '#059669' }"
            >
              {{ featuredPost.category.name }}
            </span>
            <h1 style="font-size: 2.25rem; font-weight: 800; line-height: 1.25; margin-bottom: 1rem;">
              <RouterLink :to="`/posts/${featuredPost.slug}`" style="color: #ffffff; transition: color 0.15s;" class="hover:text-emerald-400">
                {{ featuredPost.title }}
              </RouterLink>
            </h1>
            <p style="font-size: 1rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
              {{ featuredPost.summary }}
            </p>
            <div style="display: flex; align-items: center; gap: 1.5rem;">
              <RouterLink
                :to="`/posts/${featuredPost.slug}`"
                style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: var(--brand-emerald); color: #fff; font-weight: 700; border-radius: var(--radius-sm); font-size: 0.875rem;"
              >
                Read Full Story &rarr;
              </RouterLink>
              <span style="font-size: 0.8125rem; color: var(--text-subtle);">
                {{ featuredPost.read_time_minutes || 3 }} min read
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content Section: Grid & Sidebar -->
    <main class="container" style="padding-top: 3.5rem;">
      <!-- Category Filter Pills -->
      <div style="display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 2.5rem; align-items: center; justify-content: space-between;">
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          <button
            @click="setCategory('')"
            :style="!activeCategory ? 'background: var(--brand-emerald); color: #fff;' : 'background: var(--bg-surface); color: var(--text-muted);'"
            style="padding: 0.4rem 1rem; border-radius: 9999px; border: 1px solid var(--border-color); font-size: 0.8125rem; font-weight: 600; cursor: pointer;"
          >
            All Guides
          </button>
          <button
            v-for="cat in categories"
            :key="cat.slug"
            @click="setCategory(cat.slug)"
            :style="activeCategory === cat.slug ? 'background: var(--brand-emerald); color: #fff;' : 'background: var(--bg-surface); color: var(--text-muted);'"
            style="padding: 0.4rem 1rem; border-radius: 9999px; border: 1px solid var(--border-color); font-size: 0.8125rem; font-weight: 600; cursor: pointer;"
          >
            {{ cat.name }}
          </button>
        </div>

        <!-- Search Bar -->
        <div style="min-width: 240px;">
          <input
            v-model="search"
            @input="debounceSearch"
            type="text"
            placeholder="Search articles..."
            style="width: 100%; padding: 0.45rem 1rem; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-sm); color: #fff; font-size: 0.8125rem; outline: none;"
          />
        </div>
      </div>

      <!-- Articles Grid (3 Cols) -->
      <div v-if="loading" style="padding: 4rem 0; text-align: center; color: var(--text-muted);">
        Loading guides...
      </div>

      <div v-else-if="!posts.length" style="padding: 4rem 0; text-align: center; color: var(--text-muted);">
        No articles found matching your criteria.
      </div>

      <div v-else style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 2rem;">
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
