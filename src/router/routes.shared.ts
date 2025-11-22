// src/router/routes.shared.ts
import type { RouteRecordRaw } from 'vue-router'
export const sharedRoutes: RouteRecordRaw[] = [
  { path: '/', name: 'splash', component: () => import('@/modules/shared/views/StartScreen.vue') },
  { path: '/login', name: 'login', component: () => import('@/modules/shared/views/Login.vue') },
  { path: '/signup-redirect', name: 'signupRedirect', component: () => import('@/modules/shared/views/SignupRedirect.vue') },
  { path: '/signup-form', name: 'signupForm', component: () => import('@/modules/shared/views/SignupForm.vue') }
]
