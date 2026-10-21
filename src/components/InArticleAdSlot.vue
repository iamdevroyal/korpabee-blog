<template>
  <div v-if="ad" class="ad-slot-card">
    <span class="ad-slot-badge">{{ ad.badge || 'Sponsored Partner Ad' }}</span>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      <h4 style="font-size: 1.15rem; color: #ffffff; font-weight: 700;">{{ ad.title }}</h4>
      <p style="font-size: 0.875rem; color: #d1d5db;">{{ ad.description }}</p>
      <div style="margin-top: 0.75rem;">
        <a
          :href="ad.target_url || ad.click_url || 'https://korpabee.com'"
          target="_blank"
          rel="noopener noreferrer"
          style="display: inline-block; padding: 0.5rem 1.25rem; background: var(--brand-gold); color: #000; font-weight: 700; border-radius: 8px; font-size: 0.8125rem;"
        >
          {{ ad.cta_text || 'Learn More' }} &rarr;
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { blogApi } from '@/api/index.js'

const ad = ref(null)

onMounted(async () => {
  try {
    const res = await blogApi.getAds('in_article')
    if (res.data && res.data.ad) {
      ad.value = res.data.ad
    }
  } catch (err) {
    // default fallback promo
    ad.value = {
      title: 'Find Safe NYSC Lodges Near Your PPA',
      description: 'Connect with verified roommates and landlords across Nigeria with zero agent fees.',
      cta_text: 'Explore Accommodation',
      target_url: 'https://korpabee.com/housing',
      badge: 'KorpaBee Housing'
    }
  }
})
</script>
