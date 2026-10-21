<template>
  <header class="navbar">
    <div class="container navbar-inner">
      <!-- Logo with Official Brand Icon & Text -->
      <RouterLink to="/" class="brand-logo" @click="mobileMenuOpen = false">
        <img :src="logoIcon" alt="KorpaBee" class="brand-logo-icon" />
        <span>KorpaBee</span>
        <span class="brand-logo-badge">Blog</span>
      </RouterLink>

      <!-- Desktop Nav Categories -->
      <nav class="nav-links-desktop">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/category/nysc-news" class="nav-link">NYSC News</RouterLink>
        <RouterLink to="/category/pre-camp" class="nav-link">Pre-Camp</RouterLink>
        <RouterLink to="/category/orientation-camp" class="nav-link">Camp Life</RouterLink>
        <RouterLink to="/category/ppa-and-cds" class="nav-link">PPA & CDS</RouterLink>
        <RouterLink to="/category/finance-and-career" class="nav-link">Allawee & Career</RouterLink>
      </nav>

      <!-- Actions -->
      <div class="navbar-actions">
        <a
          href="https://korpabee.com"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-primary"
        >
          Open App
        </a>

        <!-- Mobile Menu Toggle Button -->
        <button
          type="button"
          class="mobile-menu-btn"
          @click="mobileMenuOpen = !mobileMenuOpen"
          :aria-expanded="mobileMenuOpen"
          aria-label="Toggle navigation"
        >
          <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Menu -->
    <div v-if="mobileMenuOpen" class="mobile-drawer">
      <RouterLink to="/" class="mobile-nav-link" @click="mobileMenuOpen = false">
        <span>🏠 Home</span>
        <span>&rsaquo;</span>
      </RouterLink>
      <RouterLink to="/category/nysc-news" class="mobile-nav-link" @click="mobileMenuOpen = false">
        <span>📢 NYSC News</span>
        <span>&rsaquo;</span>
      </RouterLink>
      <RouterLink to="/category/pre-camp" class="mobile-nav-link" @click="mobileMenuOpen = false">
        <span>📝 Pre-Camp & Senate Lists</span>
        <span>&rsaquo;</span>
      </RouterLink>
      <RouterLink to="/category/orientation-camp" class="mobile-nav-link" @click="mobileMenuOpen = false">
        <span>🏕️ Orientation Camp Life</span>
        <span>&rsaquo;</span>
      </RouterLink>
      <RouterLink to="/category/ppa-and-cds" class="mobile-nav-link" @click="mobileMenuOpen = false">
        <span>💼 PPA & Community Service</span>
        <span>&rsaquo;</span>
      </RouterLink>
      <RouterLink to="/category/finance-and-career" class="mobile-nav-link" @click="mobileMenuOpen = false">
        <span>💰 Allawee & Career Growth</span>
        <span>&rsaquo;</span>
      </RouterLink>

      <div style="margin-top: 0.5rem; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 0.5rem;">
        <a
          href="https://web.korpabee.com/register"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-primary"
          style="width: 100%; text-align: center;"
        >
          🎓 Join KorpaBee Free &rarr;
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import logoIcon from '@/assets/logo-icon.png'

const mobileMenuOpen = ref(false)
</script>
