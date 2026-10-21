import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PostDetailView from '@/views/PostDetailView.vue'
import CategoryView from '@/views/CategoryView.vue'
import TagView from '@/views/TagView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/posts/:slug',
    name: 'post.detail',
    component: PostDetailView,
  },
  {
    path: '/category/:slug',
    name: 'category',
    component: CategoryView,
  },
  {
    path: '/tag/:slug',
    name: 'tag',
    component: TagView,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

export default router
