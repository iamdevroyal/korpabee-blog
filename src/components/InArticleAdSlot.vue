<template>
  <div v-if="ad" class="ad-slot-card">
    <span class="ad-slot-badge">{{ ad.badge || 'Sponsored Partner Ad' }}</span>
    <div style="display: flex; flex-direction: column; gap: 0.4rem;">
      <h4 style="font-size: 1.05rem; color: #ffffff; font-weight: 700;">{{ ad.title }}</h4>
      <p style="font-size: 0.84375rem; color: #d1d5db; line-height: 1.5;">{{ ad.description }}</p>
      <div style="margin-top: 0.65rem;">
        <a
          :href="ad.target_url || ad.click_url || 'https://korpabee.com'"
          target="_blank"
          rel="noopener noreferrer"
          class="ad-cta-btn"
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

<style scoped>
.ad-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 1rem;
  background: var(--brand-gold);
  color: #000000;
  font-weight: 700;
  border-radius: var(--radius-sm);
  font-size: 0.78125rem;
  transition: all 0.15s ease;
  box-shadow: 0 2px 6px rgba(245, 158, 11, 0.25);
}

.ad-cta-btn:hover {
  background: #fbbf24;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(245, 158, 11, 0.4);
}
</style>
