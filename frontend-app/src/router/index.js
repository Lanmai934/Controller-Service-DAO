import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Users from '../views/Users.vue'
import About from '../views/About.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})

export default router