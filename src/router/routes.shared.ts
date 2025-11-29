// src/router/routes.shared.ts
import type { RouteRecordRaw } from 'vue-router'

export const sharedRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'splash',
    component: () => import('@/modules/shared/views/StartScreen.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/modules/shared/views/Login.vue'),
    meta: { guestOnly: true },
  },
  // Friendly alias
  {
    path: '/signup',
    name: 'signup',
    redirect: { name: 'signupForm' },
    meta: { guestOnly: true },
  },
  // Backward-compat for older links/buttons
  {
    path: '/signup-redirect',
    name: 'signupRedirect',
    redirect: { name: 'signupForm' },
    meta: { guestOnly: true },
  },
  {
    path: '/signup-form',
    name: 'signupForm',
    component: () => import('@/modules/shared/views/SignupForm.vue'),
    meta: { guestOnly: true },
  },
]
