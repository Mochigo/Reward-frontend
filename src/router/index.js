import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import ScholarshipsView from '../views/ScholarshipsView.vue'
import ApplicationsView from '../views/ApplicationsView.vue'
import ApplicationEditView from '../views/ApplicationEditView.vue'
import ScholarshipDetailView from '../views/ScholarshipDetailView.vue'
import ScholarshipEditPageView from '../views/ScholarshipEditView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import ScoreUploadView from '../views/ScoreUploadView.vue'
import DeclarationsView from '../views/DeclarationsView.vue'
import ApplicationDetailView from '../views/ApplicationDetailView.vue'

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
      component: () => import('../views/HomeView.vue'),
      // meta: {
      //   keepAlive: true //true为需要缓存，false为不需要缓存（不需要的也可以不加）
      // },
      children: [
        {
          path: '/scholarships',
          name: 'scholarships',
          component: ScholarshipsView,
          meta: {
            keepAlive: true
          },
          children: [
            {
              path: '/scholarship/detail/:id',
              name: 'scholarshipDetail',
              component: ScholarshipDetailView,
              meta: {
                keepAlive: false
              }
            },
            {
              path: '/scholarship/edit/:id',
              name: 'scholarshipEdit',
              component: ScholarshipEditPageView,
              meta: {
                keepAlive: false
              }
            },
            {
              path: '/application/detail/:id',
              name: 'applicationDetail',
              component: ApplicationDetailView,
              meta: {
                keepAlive: false
              }
            }
          ]
        },
        {
          path: '/applications',
          name: 'applications',
          component: ApplicationsView,
          meta: {
            keepAlive: true
          },
          children: [
            {
              path: '/application/edit/:id',
              name: 'applicationEdit',
              component: ApplicationEditView,
              meta: {
                keepAlive: false
              }
            }
          ]
        },
        {
          path: '/score',
          name: 'score',
          component: ScoreUploadView,
          meta: {
            keepAlive: true
          }
        },
        {
          path: '/declarations',
          name: 'declarations',
          component: DeclarationsView,
          meta: {
            keepAlive: true
          }
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
