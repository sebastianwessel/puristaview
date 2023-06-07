import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/services',
      name: 'services',
      component: HomeView
    },
    {
      path: '/events',
      name: 'events',
      component: HomeView
    },
    {
      path: '/rest-api',
      name: 'restApi',
      component: HomeView
    }
  ]
})

export default router
