import type { RouteRecordRaw } from 'vue-router'
export const workerRoutes: RouteRecordRaw[] = [
  {
    path: '/w',
    component: () => import('@/layouts/MobileStageLayout.vue'),
    meta: { requiresAuth: true, roles: ['worker'] },
    children: [
      { path: 'home', name: 'w.home', component: () => import('@/modules/worker/views/Home.vue') },
      { path: 'shifts', name: 'w.shifts', component: () => import('@/modules/worker/views/Shifts.vue') },
      { path: 'new', name: 'w.new', component: () => import('@/modules/worker/views/New.vue') },
      { path: 'reports', name: 'w.reports', component: () => import('@/modules/worker/views/Reports.vue') },
      { path: 'notifications', name: 'w.notifications', component: () => import('@/modules/worker/views/Notifications.vue') },
    ],
  },
]