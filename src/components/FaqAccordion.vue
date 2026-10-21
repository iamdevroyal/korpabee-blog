<template>
  <div v-if="faqs && faqs.length" class="faq-section">
    <h3 style="font-size: 1.35rem; color: #ffffff; margin-bottom: 1.25rem;">
      Frequently Asked Questions
    </h3>
    <div
      v-for="(faq, idx) in faqs"
      :key="idx"
      class="faq-item"
    >
      <button
        type="button"
        class="faq-question"
        @click="toggle(idx)"
      >
        <span>{{ faq.question }}</span>
        <span style="font-size: 1.25rem; font-weight: 300; margin-left: 1rem;">
          {{ openIndex === idx ? '−' : '+' }}
        </span>
      </button>
      <div v-if="openIndex === idx" class="faq-answer">
        {{ faq.answer }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  faqs: { type: Array, default: () => [] }
})

const openIndex = ref(0) // first open by default

function toggle(idx) {
  openIndex.value = openIndex.value === idx ? -1 : idx
}
</script>
