<template>
  <article class="article-card">
    <RouterLink :to="`/posts/${post.slug}`" class="card-image-wrap">
      <img
        :src="post.featured_image_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800'"
        :alt="post.title"
        loading="lazy"
        class="card-img"
      />
      <span
        v-if="post.category"
        class="card-badge"
        :style="{ backgroundColor: post.category.color_hex || '#059669' }"
      >
        {{ post.category.name }}
      </span>
    </RouterLink>

    <div class="card-content">
      <div class="card-meta">
        <span>{{ formatDate(post.published_at) }}</span>
        <span>&bull;</span>
        <span>{{ post.read_time_minutes || 3 }} min read</span>
      </div>

      <h3 class="card-title">
        <RouterLink :to="`/posts/${post.slug}`">
          {{ post.title }}
        </RouterLink>
      </h3>

      <p class="card-summary">
        {{ post.summary }}
      </p>

      <div class="card-footer">
        <RouterLink :to="`/posts/${post.slug}`" class="read-more-link">
          <span>Read Full Guide</span>
          <span class="arrow">&rarr;</span>
        </RouterLink>
      </div>
    </div>
  </article>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  post: { type: Object, required: true }
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<style scoped>
.article-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
}

.article-card:hover {
  transform: translateY(-3px);
  border-color: rgba(163, 140, 235, 0.45);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
}

.card-image-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--bg-surface-elevated);
  display: block;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.article-card:hover .card-img {
  transform: scale(1.03);
}

.card-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.card-content {
  padding: 1.15rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.71875rem;
  color: var(--text-subtle);
  margin-bottom: 0.5rem;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 0.55rem;
}

.card-title a {
  color: #ffffff;
  transition: color 0.15s ease;
}

.card-title a:hover {
  color: var(--brand-primary-light);
}

.card-summary {
  font-size: 0.8125rem;
  color: var(--text-muted);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 1rem;
  flex: 1;
}

.card-footer {
  margin-top: auto;
  border-top: 1px solid var(--border-subtle);
  padding-top: 0.65rem;
}

.read-more-link {
  font-size: 0.78125rem;
  font-weight: 600;
  color: var(--brand-primary-light);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: gap 0.15s ease;
}

.read-more-link .arrow {
  transition: transform 0.15s ease;
}

.read-more-link:hover .arrow {
  transform: translateX(3px);
}
</style>
