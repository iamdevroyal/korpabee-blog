<template>
  <header class="navbar">
    <div class="container navbar-inner">
      <!-- Logo -->
      <RouterLink to="/" class="brand-logo">
        <span class="text-2xl">🐝</span>
        <span>KorpaBee <span style="color: var(--brand-emerald-light); font-weight: 500; font-size: 0.9em;">Blog</span></span>
      </RouterLink>

      <!-- Desktop Nav Categories -->
      <nav class="nav-links">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/category/nysc-news" class="nav-link">NYSC News</RouterLink>
        <RouterLink to="/category/pre-camp" class="nav-link">Pre-Camp</RouterLink>
        <RouterLink to="/category/orientation-camp" class="nav-link">Camp Life</RouterLink>
        <RouterLink to="/category/ppa-and-cds" class="nav-link">PPA & CDS</RouterLink>
        <RouterLink to="/category/finance-and-career" class="nav-link">Allawee & Career</RouterLink>
      </nav>

      <!-- Actions -->
      <div style="display: flex; align-items: center; gap: 1rem;">
        <a
          href="https://korpabee.com"
          target="_blank"
          rel="noopener noreferrer"
          class="app-btn"
        >
          Open App
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
