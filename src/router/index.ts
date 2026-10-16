import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/rezepte/:id',
      name: 'rezept-detail',
      component: () => import('../views/RezeptDetailView.vue'),
    },
    {
      path: '/einkaufsliste',
      name: 'einkaufsliste',
      component: () => import('../views/EinkaufslisteView.vue'),
    },
  ],
})

export default router
