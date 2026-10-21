<template>
  <footer class="blog-footer">
    <div class="container">
      <div class="footer-grid">
        <!-- Col 1: Brand -->
        <div>
          <div class="footer-brand">
            <img :src="logoIcon" alt="KorpaBee" class="footer-brand-icon" />
            <span class="footer-brand-name">KorpaBee <span class="footer-brand-badge">Blog</span></span>
          </div>
          <p class="footer-brand-desc">
            The authoritative newsroom, survival guides, and career acceleration resource for Nigerian Prospective Corps Members and active Corpers.
          </p>
        </div>

        <!-- Col 2: Categories -->
        <div>
          <h4 class="footer-heading">
            Explore Guides
          </h4>
          <ul class="footer-links">
            <li><RouterLink to="/category/nysc-news" class="footer-link">NYSC Official News</RouterLink></li>
            <li><RouterLink to="/category/pre-camp" class="footer-link">Pre-Camp & Senate Lists</RouterLink></li>
            <li><RouterLink to="/category/orientation-camp" class="footer-link">Orientation Camp Life</RouterLink></li>
            <li><RouterLink to="/category/ppa-and-cds" class="footer-link">PPA & CDS Guides</RouterLink></li>
            <li><RouterLink to="/category/finance-and-career" class="footer-link">Finance & Career Tips</RouterLink></li>
          </ul>
        </div>

        <!-- Col 3: Community & Apps -->
        <div>
          <h4 class="footer-heading">
            KorpaBee Ecosystem
          </h4>
          <ul class="footer-links">
            <li><a href="https://korpabee.com" target="_blank" class="footer-link">KorpaBee App</a></li>
            <li><a href="https://korpabee.com/housing" target="_blank" class="footer-link">Corper Lodges & Housing</a></li>
            <li><a href="https://korpabee.com/cv-builder" target="_blank" class="footer-link">ATS Resume Builder</a></li>
            <li><a href="https://korpabee.com/marketplace" target="_blank" class="footer-link">Student & Corper Market</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 KorpaBee Technologies. All rights reserved.</p>
        <p>Independent platform for Nigerian youth corps members.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import logoIcon from '@/assets/logo-icon.png'
</script>

<style scoped>
.blog-footer {
  background: var(--bg-surface);
  border-top: 1px solid var(--border-color);
  padding: 3rem 0 2rem;
  margin-top: auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2.5rem;
}

@media (min-width: 640px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .footer-grid {
    grid-template-columns: 1.5fr 1fr 1fr;
    gap: 3rem;
  }
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.footer-brand-icon {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.footer-brand-name {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.15rem;
  color: #ffffff;
}

.footer-brand-badge {
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--brand-emerald-light);
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 0.1rem 0.4rem;
  border-radius: 9999px;
  margin-left: 0.25rem;
}

.footer-brand-desc {
  font-size: 0.8125rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.footer-heading {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.85rem;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.footer-link {
  font-size: 0.8125rem;
  color: var(--text-muted);
  transition: color 0.15s ease;
}

.footer-link:hover {
  color: #ffffff;
}

.footer-bottom {
  border-top: 1px solid var(--border-subtle);
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.71875rem;
  color: var(--text-subtle);
}

@media (min-width: 640px) {
  .footer-bottom {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
