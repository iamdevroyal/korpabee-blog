<template>
  <div class="app-layout">
    <!-- Top Persistent Sticky Join KorpaBee Banner -->
    <HeaderBanner />

    <!-- Navigation Header -->
    <BlogNavbar />

    <!-- Main Content Area -->
    <RouterView />

    <!-- Site Footer -->
    <BlogFooter />
  </div>
</template>

<script setup>
import HeaderBanner from '@/components/HeaderBanner.vue'
import BlogNavbar from '@/components/BlogNavbar.vue'
import BlogFooter from '@/components/BlogFooter.vue'
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
