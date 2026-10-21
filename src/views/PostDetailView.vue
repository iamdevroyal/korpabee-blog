<template>
  <div style="width: 100%; max-width: 100%; overflow-x: hidden;">
    <!-- Loading State -->
    <div v-if="loading" style="padding: 6rem 0; text-align: center; color: var(--text-muted); font-size: 0.875rem;">
      Loading verified guide...
    </div>

    <!-- 404 State -->
    <div v-else-if="!post" style="padding: 6rem 0; text-align: center;">
      <h2 style="font-size: 1.5rem; margin-bottom: 0.75rem;">Article Not Found</h2>
      <p style="color: var(--text-muted); margin-bottom: 1.5rem; font-size: 0.875rem;">The guide you requested may have moved or been updated.</p>
      <RouterLink to="/" class="btn-primary">Return to Blog Home</RouterLink>
    </div>

    <!-- Article Content -->
    <article v-else class="container" style="max-width: 820px; padding-top: 1.75rem; padding-bottom: 4rem;">
      <!-- Breadcrumbs -->
      <nav class="article-breadcrumbs" aria-label="Breadcrumb">
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
        <span style="color: var(--text-main); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{ post.title }}</span>
      </nav>

      <!-- Category & Meta -->
      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem; margin-bottom: 0.85rem;">
        <RouterLink
          v-if="post.category"
          :to="`/category/${post.category.slug}`"
          style="padding: 0.2rem 0.65rem; border-radius: 9999px; font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; color: #fff; letter-spacing: 0.04em;"
          :style="{ backgroundColor: post.category.color_hex || '#059669' }"
        >
          {{ post.category.name }}
        </RouterLink>
        <span style="font-size: 0.75rem; color: var(--text-subtle);">
          {{ formatDate(post.published_at) }}
        </span>
        <span style="color: var(--text-subtle); font-size: 0.75rem;">&bull;</span>
        <span style="font-size: 0.75rem; color: var(--text-subtle);">
          {{ post.read_time_minutes || 3 }} min read
        </span>
      </div>

      <!-- Title -->
      <h1 class="article-title">
        {{ post.title }}
      </h1>

      <!-- Author Card -->
      <div class="article-author-card">
        <img
          :src="post.author?.avatar || logoIcon"
          alt="Author"
          class="author-avatar"
        />
        <div>
          <p style="font-size: 0.84375rem; font-weight: 600; color: #fff;">
            {{ post.author?.name || 'KorpaBee Editorial Team' }}
          </p>
          <p style="font-size: 0.71875rem; color: var(--brand-primary-light);">
            {{ post.author?.role || 'Verified NYSC Editor' }}
          </p>
        </div>
      </div>

      <!-- Featured Image -->
      <figure v-if="post.featured_image_url" style="margin-bottom: 2rem;">
        <img
          :src="post.featured_image_url"
          :alt="post.title"
          style="width: 100%; max-height: 460px; object-fit: cover; border-radius: var(--radius-lg); border: 1px solid var(--border-color); box-shadow: 0 10px 30px rgba(0,0,0,0.4);"
        />
        <figcaption v-if="post.featured_image_caption" style="font-size: 0.71875rem; color: var(--text-subtle); margin-top: 0.45rem; text-align: center; font-style: italic;">
          {{ post.featured_image_caption }}
        </figcaption>
      </figure>

      <!-- AI Quick Answer / Executive Summary Box -->
      <div v-if="post.summary" class="ai-executive-summary">
        <h3>⚡ Quick Takeaways / Executive Summary</h3>
        <p style="font-size: 0.875rem; color: #d1d5db; line-height: 1.6;">
          {{ post.summary }}
        </p>
      </div>

      <!-- Article Body with Floating Resizable Media -->
      <div class="article-body" v-html="post.content_html"></div>

      <!-- In-Article Business Ad Slot -->
      <InArticleAdSlot />

      <!-- FAQ Accordion -->
      <FaqAccordion
        v-if="post.faqs && post.faqs.length"
        :faqs="post.faqs"
      />

      <!-- Article Tags -->
      <div v-if="post.tags && post.tags.length" style="margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-subtle); display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center;">
        <span style="font-size: 0.75rem; color: var(--text-subtle); margin-right: 0.4rem;">Tags:</span>
        <RouterLink
          v-for="tag in post.tags"
          :key="tag.slug"
          :to="`/tag/${tag.slug}`"
          style="padding: 0.2rem 0.55rem; background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: 9999px; font-size: 0.71875rem; color: var(--text-muted);"
        >
          #{{ tag.name }}
        </RouterLink>
      </div>

      <!-- Related Articles Section -->
      <div v-if="relatedPosts && relatedPosts.length" style="margin-top: 3.5rem; padding-top: 2rem; border-top: 1px solid var(--border-color);">
        <h3 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 1.25rem;">
          Related Guides & Articles
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem;">
          <RouterLink
            v-for="rel in relatedPosts"
            :key="rel.uuid || rel.slug"
            :to="`/posts/${rel.slug}`"
            class="related-card"
          >
            <div style="aspect-ratio: 16/9; overflow: hidden; border-radius: 8px; margin-bottom: 0.6rem; background: var(--bg-surface-elevated);">
              <img
                :src="rel.featured_image_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500'"
                :alt="rel.title"
                style="width: 100%; height: 100%; object-fit: cover;"
              />
            </div>
            <h4 style="font-size: 0.875rem; font-weight: 600; color: #fff; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              {{ rel.title }}
            </h4>
            <span style="font-size: 0.71875rem; color: var(--brand-primary-light); margin-top: 0.35rem; display: inline-block;">Read Guide &rarr;</span>
          </RouterLink>
        </div>
      </div>

      <!-- Bottom Engagement Banner -->
      <div class="bottom-engagement-banner">
        <div style="flex: 1;">
          <h4 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.25rem; color: #fff;">
            Connect with 50,000+ Serving Corps Members
          </h4>
          <p style="font-size: 0.8125rem; color: var(--text-muted);">
            Join state WhatsApp and Telegram communities, find trusted housing, and build your ATS-ready resume.
          </p>
        </div>
        <a
          href="https://web.korpabee.com/register"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-primary"
          style="padding: 0.55rem 1.15rem; font-size: 0.8125rem; flex-shrink: 0;"
        >
          Join KorpaBee Free &rarr;
        </a>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useHead } from 'unhead'
import { blogApi } from '@/api/index.js'
import logoIcon from '@/assets/logo-icon.png'
import FaqAccordion from '@/components/FaqAccordion.vue'
import InArticleAdSlot from '@/components/InArticleAdSlot.vue'

const route = useRoute()
const post = ref(null)
const relatedPosts = ref([])
const loading = ref(false)

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

async function fetchPost() {
  loading.value = true
  try {
    const res = await blogApi.getPost(route.params.slug)
    const postData = res.data?.data || res.data?.post
    if (postData) {
      post.value = postData
      relatedPosts.value = res.data?.related || []
      
      const canonicalUrl = `https://blog.korpabee.com/posts/${post.value.slug}`
      const metaDescription = post.value.meta_description || post.value.summary || ''
      const ogImage = post.value.featured_image_url || 'https://blog.korpabee.com/og-image.png'
      const keywords = post.value.tags?.map(t => t.name).join(', ') || 'NYSC, KorpaBee, Corps Members, Nigeria'

      // Rich Schema.org JSON-LD for Search Engines & AI Search Engines (Perplexity, ChatGPT, Gemini, Copilot)
      const schemaArticle = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        'headline': post.value.title,
        'description': metaDescription,
        'image': [ogImage],
        'datePublished': post.value.published_at || post.value.created_at,
        'dateModified': post.value.updated_at || post.value.published_at,
        'author': {
          '@type': 'Person',
          'name': post.value.author?.name || 'KorpaBee Editorial Team',
          'jobTitle': post.value.author?.role || 'Verified NYSC Editor',
          'worksFor': {
            '@type': 'Organization',
            'name': 'KorpaBee',
            'url': 'https://korpabee.com'
          }
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'KorpaBee Blog',
          'url': 'https://blog.korpabee.com',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://blog.korpabee.com/logo.png'
          }
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': canonicalUrl
        },
        'keywords': keywords,
        'articleSection': post.value.category?.name || 'NYSC Guides',
        'inLanguage': 'en-NG'
      }

      // BreadcrumbList Schema
      const schemaBreadcrumbs = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://blog.korpabee.com'
          },
          ...(post.value.category ? [{
            '@type': 'ListItem',
            'position': 2,
            'name': post.value.category.name,
            'item': `https://blog.korpabee.com/category/${post.value.category.slug}`
          }] : []),
          {
            '@type': 'ListItem',
            'position': post.value.category ? 3 : 2,
            'name': post.value.title,
            'item': canonicalUrl
          }
        ]
      }

      // Dynamic Head Tags for SEO & AI Indexing
      useHead({
        title: `${post.value.title} | KorpaBee Blog`,
        link: [
          { rel: 'canonical', href: canonicalUrl }
        ],
        meta: [
          { name: 'description', content: metaDescription },
          { name: 'keywords', content: keywords },
          { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
          { property: 'og:site_name', content: 'KorpaBee Blog' },
          { property: 'og:type', content: 'article' },
          { property: 'og:url', content: canonicalUrl },
          { property: 'og:title', content: post.value.title },
          { property: 'og:description', content: metaDescription },
          { property: 'og:image', content: ogImage },
          { property: 'article:published_time', content: post.value.published_at || '' },
          { property: 'article:section', content: post.value.category?.name || 'General' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:site', content: '@korpabee' },
          { name: 'twitter:title', content: post.value.title },
          { name: 'twitter:description', content: metaDescription },
          { name: 'twitter:image', content: ogImage }
        ],
        script: [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify(schemaArticle)
          },
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify(schemaBreadcrumbs)
          }
        ]
      })
    } else {
      post.value = null
    }
  } catch (err) {
    console.error('Failed to load post:', err)
    post.value = null
  } finally {
    loading.value = false
  }
}

watch(() => route.params.slug, () => {
  fetchPost()
})

onMounted(() => {
  fetchPost()
})
</script>

<style scoped>
.article-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.71875rem;
  color: var(--text-subtle);
  margin-bottom: 1.25rem;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
}
.article-breadcrumbs::-webkit-scrollbar {
  display: none;
}

.article-title {
  font-size: clamp(1.4rem, 4vw, 2.3rem);
  font-weight: 800;
  line-height: 1.25;
  margin-bottom: 1.15rem;
}

.article-author-card {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1.75rem;
}

.author-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--bg-surface-elevated);
}

.related-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  transition: transform 0.2s ease, border-color 0.2s ease;
  display: flex;
  flex-direction: column;
}
.related-card:hover {
  transform: translateY(-2px);
  border-color: rgba(163, 140, 235, 0.45);
}

.bottom-engagement-banner {
  margin-top: 3.5rem;
  padding: 1.35rem;
  background: linear-gradient(135deg, rgba(60, 12, 160, 0.45) 0%, rgba(15, 5, 43, 0.85) 100%);
  border: 1px solid rgba(163, 140, 235, 0.35);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .bottom-engagement-banner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 1.75rem;
  }
}
</style>
