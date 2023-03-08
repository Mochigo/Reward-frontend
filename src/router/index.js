import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import ScholarshipsView from '../views/ScholarshipsView.vue'
import ApplicationsView from '../views/ApplicationsView.vue'
import ScholarshipDetailView from '../views/ScholarshipDetailView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/404'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/404',
      name: 'pageNotFound',
      component: NotFoundView
    },
    {
      path: '/home',
      component: () => import('../views/StudentHomePageView.vue'),
      children: [
        {
          path: '/scholarships',
          name: 'scholarships',
          component: ScholarshipsView,
          children: [
            {
              path: '/scholarship/detail/:id',
              name: 'scholarshipDetail',
              component: ScholarshipDetailView
            }
          ]
        },
        {
          path: '/applications',
          name: 'applications',
          component: ApplicationsView
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.localStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
