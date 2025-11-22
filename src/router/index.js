// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/modules/shared/stores/useAuth'

// These must export named arrays: `export const businessRoutes = [...]` etc.
import { businessRoutes } from '@/modules/business/router'
import { workerRoutes }   from '@/modules/worker/router'

const publicRoutes = [
  {
    path: '/',
    name: 'splash',
    component: () => import('@/modules/shared/views/StartScreen.vue'), // <-- update to real path
    meta: { guestOnly: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/modules/shared/views/Login.vue'), // <-- update to real path
    meta: { guestOnly: true },
  },
]

const notFound = {
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: () => import('@/modules/shared/views/NotFound.vue'), // <-- update to real path
}


const router = createRouter({
  history: createWebHistory(), // add base if you deploy under a sub-path
  routes: [
    ...publicRoutes,
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

  // Derived meta across matched records (handles parent layouts)
  const requiresAuth = to.matched.some(r => r.meta && r.meta.requiresAuth)
  const rolesFromMatched = to.matched.flatMap(r => (r.meta?.roles || []))
  const hasRoleGate = rolesFromMatched.length > 0

  // 1) Logged-in users shouldn't see guest-only pages
  if (to.matched.some(r => r.meta && r.meta.guestOnly) && auth.isAuthenticated) {
    return homeFor(auth.role)
  }

  // 2) Protected routes require auth
  if (requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // 3) Role-gated routes
  if (requiresAuth && hasRoleGate && auth.role && !rolesFromMatched.includes(auth.role)) {
    return homeFor(auth.role)
  }

  return true
})

export default router
