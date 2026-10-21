<template>
  <footer style="background: var(--bg-surface); border-top: 1px solid var(--border-color); padding: 4rem 0 2rem; margin-top: 5rem;">
    <div class="container">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2.5rem; margin-bottom: 3rem;">
        <!-- Col 1: Brand -->
        <div>
          <div class="brand-logo" style="margin-bottom: 1rem;">
            <span>🐝</span>
            <span>KorpaBee Blog</span>
          </div>
          <p style="font-size: 0.8125rem; color: var(--text-muted); line-height: 1.6;">
            The authoritative newsroom, survival guides, and career acceleration resource for Nigerian Prospective Corps Members and active Corpers.
          </p>
        </div>

        <!-- Col 2: Categories -->
        <div>
          <h4 style="font-size: 0.875rem; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem;">
            Explore Categories
          </h4>
          <ul style="list-style: none; font-size: 0.8125rem; space-y: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
            <li><RouterLink to="/category/nysc-news" style="color: var(--text-muted); transition: color 0.15s;" class="hover:text-white">NYSC Official News</RouterLink></li>
            <li><RouterLink to="/category/pre-camp" style="color: var(--text-muted); transition: color 0.15s;" class="hover:text-white">Pre-Camp & Registration</RouterLink></li>
            <li><RouterLink to="/category/orientation-camp" style="color: var(--text-muted); transition: color 0.15s;" class="hover:text-white">Orientation Camp Life</RouterLink></li>
            <li><RouterLink to="/category/ppa-and-cds" style="color: var(--text-muted); transition: color 0.15s;" class="hover:text-white">PPA & CDS Guides</RouterLink></li>
            <li><RouterLink to="/category/finance-and-career" style="color: var(--text-muted); transition: color 0.15s;" class="hover:text-white">Finance & Career Tips</RouterLink></li>
          </ul>
        </div>

        <!-- Col 3: Community & Apps -->
        <div>
          <h4 style="font-size: 0.875rem; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem;">
            KorpaBee Ecosystem
          </h4>
          <ul style="list-style: none; font-size: 0.8125rem; display: flex; flex-direction: column; gap: 0.5rem;">
            <li><a href="https://korpabee.com" target="_blank" style="color: var(--text-muted);">User Web Platform</a></li>
            <li><a href="https://korpabee.com/housing" target="_blank" style="color: var(--text-muted);">Corper Lodges & Housing</a></li>
            <li><a href="https://korpabee.com/cv-builder" target="_blank" style="color: var(--text-muted);">ATS CV Builder</a></li>
            <li><a href="https://korpabee.com/marketplace" target="_blank" style="color: var(--text-muted);">Student & Corper Market</a></li>
          </ul>
        </div>
      </div>

      <div style="border-top: 1px solid var(--border-subtle); padding-top: 2rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; font-size: 0.75rem; color: var(--text-subtle);">
        <p>&copy; 2026 KorpaBee Technologies. All rights reserved.</p>
        <p>Independent platform for corps members. Not an official government agency.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
