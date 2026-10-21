<template>
  <div v-if="visible" class="join-header-banner">
    <span class="banner-text-desktop">
      🎓 Prospective or serving Corps Member? Join 50,000+ Corpers on KorpaBee.
    </span>
    <span class="banner-text-mobile">
      🎓 Join 50,000+ Corpers on KorpaBee
    </span>
    <a
      href="https://web.korpabee.com/register"
      target="_blank"
      rel="noopener noreferrer"
      class="cta-btn"
    >
      Join Free &rarr;
    </a>
    <button
      type="button"
      class="close-banner-btn"
      @click="dismiss"
      aria-label="Dismiss banner"
      title="Dismiss banner"
    >
      &times;
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(true)

onMounted(() => {
  if (sessionStorage.getItem('korpabee_banner_closed') === 'true') {
    visible.value = false
  }
})

function dismiss() {
  visible.value = false
  try {
    sessionStorage.setItem('korpabee_banner_closed', 'true')
  } catch (e) {}
}
</script>
