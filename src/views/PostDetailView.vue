<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" style="padding: 6rem 0; text-align: center; color: var(--text-muted);">
      Loading article...
    </div>

    <!-- 404 State -->
    <div v-else-if="!post" style="padding: 6rem 0; text-align: center;">
      <h2 style="font-size: 1.75rem; margin-bottom: 1rem;">Article Not Found</h2>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">The guide you requested may have moved or been updated.</p>
      <RouterLink to="/" class="app-btn">Return to Blog Home</RouterLink>
    </div>

    <!-- Article Content -->
    <article v-else class="container" style="max-width: 860px; padding-top: 2.5rem;">
      <!-- Breadcrumbs -->
      <nav style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--text-subtle); margin-bottom: 1.5rem;">
        <RouterLink to="/" style="color: var(--text-muted);">Home</RouterLink>
        <span>&rsaquo;</span>
        <RouterLink
          v-if="post.category"
          :to="`/category/${post.category.slug}`"
          style="color: var(--text-muted);"
        >
          {{ post.category.name }}
        </RouterLink>
        <span>&rsaquo;</span>
        <span style="color: var(--text-main); font-weight: 500;" class="truncate">{{ post.title }}</span>
      </nav>

      <!-- Category & Meta -->
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
        <RouterLink
          v-if="post.category"
          :to="`/category/${post.category.slug}`"
          style="padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; color: #fff;"
          :style="{ backgroundColor: post.category.color_hex || '#059669' }"
        >
          {{ post.category.name }}
        </RouterLink>
        <span style="font-size: 0.8125rem; color: var(--text-subtle);">
          Published {{ formatDate(post.published_at) }}
        </span>
        <span style="color: var(--text-subtle);">&bull;</span>
        <span style="font-size: 0.8125rem; color: var(--text-subtle);">
          {{ post.read_time_minutes || 3 }} min read
        </span>
      </div>

      <!-- Title -->
      <h1 style="font-size: 2.35rem; font-weight: 800; line-height: 1.25; margin-bottom: 1.25rem;">
        {{ post.title }}
      </h1>

      <!-- Author Card -->
      <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem 0; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); margin-bottom: 2rem;">
        <img
          :src="post.author?.avatar || 'https://assets.korpabee.com/branding/korpabee_official_badge.png'"
          alt="Author"
          style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover;"
        />
        <div>
          <p style="font-size: 0.875rem; font-weight: 600; color: #fff;">
            {{ post.author?.name || 'KorpaBee Editorial Team' }}
          </p>
          <p style="font-size: 0.75rem; color: var(--brand-emerald-light);">
            {{ post.author?.role || 'Verified NYSC Editor' }}
          </p>
        </div>
      </div>

      <!-- Featured Image -->
      <figure v-if="post.featured_image_url" style="margin-bottom: 2.5rem;">
        <img
          :src="post.featured_image_url"
          :alt="post.title"
          style="width: 100%; max-height: 480px; object-fit: cover; border-radius: var(--radius-lg); border: 1px solid var(--border-color); box-shadow: 0 10px 30px rgba(0,0,0,0.5);"
        />
        <figcaption v-if="post.featured_image_caption" style="font-size: 0.75rem; color: var(--text-subtle); margin-top: 0.5rem; text-align: center; font-style: italic;">
          {{ post.featured_image_caption }}
        </figcaption>
      </figure>

      <!-- AI Quick Answer / Executive Summary Box -->
      <div class="ai-executive-summary">
        <h3>⚡ Quick Takeaways / Executive Summary</h3>
        <p style="font-size: 0.9375rem; color: #d1d5db; line-height: 1.6;">
          {{ post.summary }}
        </p>
      </div>

      <!-- Article Body with Floating Resizable Media -->
      <div class="article-body" v-html="post.content_html"></div>

      <!-- In-Article Business Ad Slot -->
      <InArticleAdSlot />

      <!-- FAQ Accordion -->
      <FaqAccordion
        v-if="post.seo?.faq_schema && post.seo.faq_schema.length"
        :faqs="post.seo.faq_schema"
      />

      <!-- Tags Cloud -->
      <div v-if="post.tags && post.tags.length" style="margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
        <p style="font-size: 0.75rem; font-weight: 700; color: var(--text-subtle); text-transform: uppercase; margin-bottom: 0.75rem;">
          Related Topics & Tags
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          <RouterLink
            v-for="tag in post.tags"
            :key="tag.slug"
            :to="`/tag/${tag.slug}`"
            style="padding: 0.3rem 0.75rem; border-radius: 9999px; background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-muted); font-size: 0.75rem; transition: color 0.15s;"
            class="hover:text-white"
          >
            #{{ tag.name }}
          </RouterLink>
        </div>
      </div>

      <!-- Join KorpaBee Bottom Banner -->
      <div style="margin-top: 4rem; padding: 2rem; border-radius: var(--radius-lg); background: linear-gradient(135deg, rgba(5, 150, 105, 0.2) 0%, rgba(17, 23, 38, 0.9) 100%); border: 1px solid rgba(16, 185, 129, 0.3); text-align: center;">
        <h3 style="font-size: 1.5rem; color: #fff; margin-bottom: 0.5rem;">
          Ready to Ace Your NYSC Service Year? 🐝
        </h3>
        <p style="font-size: 0.875rem; color: var(--text-muted); max-width: 520px; margin: 0 auto 1.5rem;">
          Join over 50,000 corps members. Connect with your platoon, find verified lodges near your PPA, and access automated allawee tracking.
        </p>
        <a
          href="https://korpabee.com/register"
          target="_blank"
          rel="noopener noreferrer"
          style="display: inline-block; padding: 0.75rem 1.75rem; background: var(--brand-emerald); color: #fff; font-weight: 700; border-radius: var(--radius-sm); font-size: 0.875rem;"
        >
          Create Free Account &rarr;
        </a>
      </div>

      <!-- Related Guides (3 Cols) -->
      <div v-if="relatedPosts.length" style="margin-top: 4.5rem;">
        <h3 style="font-size: 1.35rem; color: #fff; margin-bottom: 1.5rem;">
          Related Guides & Updates
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem;">
          <ArticleCard
            v-for="rel in relatedPosts"
            :key="rel.uuid"
            :post="rel"
          />
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useHead } from 'unhead'
import { blogApi } from '@/api/index.js'
import InArticleAdSlot from '@/components/InArticleAdSlot.vue'
import FaqAccordion from '@/components/FaqAccordion.vue'
import ArticleCard from '@/components/ArticleCard.vue'

const route = useRoute()
const post = ref(null)
const relatedPosts = ref([])
const loading = ref(false)

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

async function fetchPostData() {
  loading.value = true
  try {
    const slug = route.params.slug
    const res = await blogApi.getPost(slug)
    if (res.data && res.data.data) {
      post.value = res.data.data
      relatedPosts.value = res.data.related || []
      applySeo(post.value)
    }
  } catch (err) {
    console.error('Failed to load post detail:', err)
  } finally {
    loading.value = false
  }
}

function applySeo(p) {
  const title = p.seo?.meta_title || `${p.title} | KorpaBee Blog`
  const description = p.seo?.meta_description || p.summary
  const url = p.seo?.canonical_url || `https://blog.korpabee.com/posts/${p.slug}`
  const image = p.seo?.og_image_url || p.featured_image_url

  // JSON-LD structured data schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: description,
    image: image,
    datePublished: p.published_at,
    author: {
      '@type': 'Organization',
      name: p.author?.name || 'KorpaBee Editorial Team',
      url: 'https://korpabee.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'KorpaBee',
      logo: {
        '@type': 'ImageObject',
        url: 'https://assets.korpabee.com/branding/korpabee_official_badge.png'
      }
    },
    mainEntityOfPage: url
  }

  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    link: [
      { rel: 'canonical', href: url }
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(articleSchema)
      }
    ]
  })
}

watch(() => route.params.slug, () => {
  fetchPostData()
})

onMounted(() => {
  fetchPostData()
})
</script>
