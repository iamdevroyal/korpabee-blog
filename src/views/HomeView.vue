<template>
  <div style="width: 100%; max-width: 100%; overflow-x: hidden;">
    <!-- Hero Spotlight Section (Continuous Carousel with Pause on Hover) -->
    <section
      v-if="heroPosts.length"
      class="hero-spotlight"
      @mouseenter="onHeroMouseEnter"
      @mouseleave="onHeroMouseLeave"
      aria-label="Recent Featured Articles Carousel"
    >
      <div class="container">
        <!-- Carousel Header / Live Status Indicator -->
        <div class="hero-top-bar">
          <div class="hero-carousel-badge">
            <span class="pulse-dot" :class="{ paused: isHovered }"></span>
            <span>{{ isHovered ? 'Paused on hover' : 'Recent Spotlight' }}</span>
          </div>

          <!-- Carousel Controls (Prev / Next & Counter) -->
          <div class="hero-nav-controls">
            <button
              type="button"
              class="hero-arrow-btn"
              @click="prevSlide"
              aria-label="Previous story"
              title="Previous story"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <span class="hero-slide-counter">
              {{ String(currentSlide + 1).padStart(2, '0') }} / {{ String(heroPosts.length).padStart(2, '0') }}
            </span>
            <button
              type="button"
              class="hero-arrow-btn"
              @click="nextSlide"
              aria-label="Next story"
              title="Next story"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- Slide Transition Container -->
        <Transition name="hero-slide" mode="out-in">
          <div v-if="currentPost" :key="currentPost.id" class="hero-grid">
            <!-- Featured Image -->
            <div class="hero-image-wrap">
              <RouterLink :to="`/posts/${currentPost.slug}`" class="hero-link">
                <img
                  :src="currentPost.featured_image_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200'"
                  :alt="currentPost.title"
                  class="hero-img"
                  loading="eager"
                />
              </RouterLink>
            </div>

            <!-- Featured Info -->
            <div class="hero-info">
              <div class="hero-meta-row">
                <span
                  v-if="currentPost.category"
                  class="hero-badge"
                  :style="{ backgroundColor: currentPost.category.color_hex || '#059669' }"
                >
                  {{ currentPost.category.name }}
                </span>
                <span class="hero-date">
                  {{ formatDate(currentPost.published_at) }}
                </span>
              </div>

              <h1 class="hero-title">
                <RouterLink :to="`/posts/${currentPost.slug}`" class="hero-title-link">
                  {{ currentPost.title }}
                </RouterLink>
              </h1>

              <p class="hero-summary">
                {{ currentPost.summary }}
              </p>

              <div class="hero-actions">
                <RouterLink
                  :to="`/posts/${currentPost.slug}`"
                  class="btn-primary hero-cta-btn"
                >
                  Read Full Story &rarr;
                </RouterLink>
                <span class="hero-read-time">
                  {{ currentPost.read_time_minutes || 4 }} min read
                </span>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Carousel Pagination Dots -->
        <div class="hero-dots-wrap">
          <button
            v-for="(post, idx) in heroPosts"
            :key="post.id"
            type="button"
            class="hero-dot"
            :class="{ active: currentSlide === idx }"
            @click="goToSlide(idx)"
            :aria-label="`Go to story ${idx + 1}`"
          ></button>
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
          :key="post.id || post.uuid"
          :post="post"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useHead } from 'unhead'
import { blogApi } from '@/api/index.js'
import ArticleCard from '@/components/ArticleCard.vue'

useHead({
  title: 'KorpaBee Blog — Verified NYSC News, Guides, and Survival Tips',
  link: [
    { rel: 'canonical', href: 'https://blog.korpabee.com' }
  ],
  meta: [
    { name: 'description', content: 'Authoritative resource for Nigerian Prospective Corps Members and active Corpers. Stay updated with verified senate lists, mobilization dates, and camp survival guides.' },
    { name: 'keywords', content: 'NYSC, NYSC Blog, Senate List, Call Up Letter, NYSC Mobilization, NYSC Camp, Allawee, KorpaBee, CDS, PPA' },
    { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
    { property: 'og:site_name', content: 'KorpaBee Blog' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://blog.korpabee.com' },
    { property: 'og:title', content: 'KorpaBee Blog — Verified NYSC News, Guides, and Survival Tips' },
    { property: 'og:description', content: 'Your trusted companion for NYSC service year survival, finance, and career acceleration.' },
    { property: 'og:image', content: 'https://blog.korpabee.com/og-image.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@korpabee' },
    { name: 'twitter:title', content: 'KorpaBee Blog — Verified NYSC News & Guides' },
    { name: 'twitter:description', content: 'Authoritative newsroom and survival guides for Nigerian Prospective Corps Members.' },
    { name: 'twitter:image', content: 'https://blog.korpabee.com/og-image.png' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "KorpaBee Blog",
        "url": "https://blog.korpabee.com",
        "description": "Authoritative newsroom, verified NYSC survival guides, mobilization calendars, senate list tips, and career acceleration for Nigerian Corps Members.",
        "publisher": {
          "@type": "Organization",
          "name": "KorpaBee Technologies",
          "url": "https://korpabee.com",
          "logo": "https://blog.korpabee.com/logo.png"
        }
      })
    }
  ]
})

const posts = ref([])
const categories = ref([])
const activeCategory = ref('')
const search = ref('')
const loading = ref(false)

// Hero Carousel State
const currentSlide = ref(0)
const isHovered = ref(false)
let autoplayTimer = null
let debounceTimer = null

// Up to 5 most recent posts for the Hero Carousel
const heroPosts = computed(() => posts.value.slice(0, 5))
const currentPost = computed(() => heroPosts.value[currentSlide.value] || null)

function nextSlide() {
  if (!heroPosts.value.length) return
  currentSlide.value = (currentSlide.value + 1) % heroPosts.value.length
}

function prevSlide() {
  if (!heroPosts.value.length) return
  currentSlide.value = (currentSlide.value - 1 + heroPosts.value.length) % heroPosts.value.length
}

function goToSlide(index) {
  currentSlide.value = index
}

function onHeroMouseEnter() {
  isHovered.value = true
}

function onHeroMouseLeave() {
  isHovered.value = false
}

function startAutoplay() {
  stopAutoplay()
  autoplayTimer = setInterval(() => {
    if (!isHovered.value && heroPosts.value.length > 1) {
      nextSlide()
    }
  }, 4500)
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function debounceSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
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
      if (currentSlide.value >= heroPosts.value.length) {
        currentSlide.value = 0
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
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
  clearTimeout(debounceTimer)
})
</script>

<style scoped>
.hero-spotlight {
  background: linear-gradient(180deg, rgba(60, 12, 160, 0.18) 0%, rgba(10, 14, 23, 0.6) 100%);
  padding: 1.5rem 0 2rem;
  border-bottom: 1px solid var(--border-subtle);
  position: relative;
  transition: background 0.3s ease;
}

@media (min-width: 768px) {
  .hero-spotlight {
    padding: 2.25rem 0 2.75rem;
  }
}

/* Top Bar: Live Status & Arrows */
.hero-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding: 0 0.25rem;
}

.hero-carousel-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.02em;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
  animation: pulseAnimation 2s infinite ease-in-out;
}

.pulse-dot.paused {
  background: #f59e0b;
  box-shadow: 0 0 8px #f59e0b;
  animation: none;
}

@keyframes pulseAnimation {
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
}

.hero-nav-controls {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.hero-arrow-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hero-arrow-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.hero-slide-counter {
  font-size: 0.78125rem;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.05em;
  font-variant-numeric: tabular-nums;
}

/* Grid Layout */
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
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.45);
  background: var(--bg-surface-elevated);
  position: relative;
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
  transition: transform 0.4s ease;
}

.hero-image-wrap:hover .hero-img {
  transform: scale(1.03);
}

.hero-info {
  display: flex;
  flex-direction: column;
}

.hero-meta-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.hero-badge {
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #fff;
  letter-spacing: 0.04em;
}

.hero-date {
  font-size: 0.75rem;
  color: var(--text-subtle);
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
  color: var(--brand-primary-light);
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

.hero-cta-btn {
  padding: 0.65rem 1.35rem;
  font-size: 0.84375rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 14px rgba(5, 150, 105, 0.3);
}

.hero-read-time {
  font-size: 0.78125rem;
  color: var(--text-subtle);
}

/* Dots Indicator */
.hero-dots-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.75rem;
}

.hero-dot {
  height: 6px;
  width: 8px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-dot:hover {
  background: rgba(255, 255, 255, 0.4);
}

.hero-dot.active {
  width: 24px;
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
}

/* Smooth Slide Transitions */
.hero-slide-enter-active,
.hero-slide-leave-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}

.hero-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.hero-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
