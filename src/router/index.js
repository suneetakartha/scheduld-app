// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/modules/shared/stores/useAuth'
import { sharedRoutes }   from '@/router/routes.shared'   // <— bring them in
import { businessRoutes } from '@/modules/business/router'
import { workerRoutes }   from '@/modules/worker/router'

const notFound = {
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: () => import('@/modules/shared/views/NotFound.vue'),
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...sharedRoutes,   // <— use your shared file here
    ...businessRoutes,
    ...workerRoutes,
    notFound,
  ],
})

function homeFor(role) {
  return role === 'business' ? { name: 'b.home' } : { name: 'w.home' }
}

router.beforeEach((to) => {
  const auth = useAuth()

  const requiresAuth = to.matched.some(r => r.meta?.requiresAuth)
  const guestOnly    = to.matched.some(r => r.meta?.guestOnly)
  const rolesNeeded  = to.matched.flatMap(r => r.meta?.roles || [])

  if (guestOnly && auth.isAuthenticated) return homeFor(auth.role)
  if (requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (requiresAuth && rolesNeeded.length && auth.role && !rolesNeeded.includes(auth.role)) {
    return homeFor(auth.role)
  }
  return true
})

export default router
