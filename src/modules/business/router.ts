// src/modules/business/router.ts
import type { RouteRecordRaw } from 'vue-router'

export const businessRoutes: RouteRecordRaw[] = [
  {
    path: '/b',
    component: () => import('@/layouts/MobileStageLayout.vue'),
    meta: { requiresAuth: true, roles: ['business'] },
    children: [
      { path: 'home', name: 'b.home', component: () => import('@/modules/business/views/Home.vue') },

      {
        path: 'shifts',
        name: 'b.shifts',
        component: () => import('@/modules/business/views/Schedule/ShiftMain.vue'),
        // 🔸 No redirect here — `/b/shifts` shows the main shell.
        children: [
          {
            path: 'source',
            name: 'b.schedule.source',
            component: () => import('@/modules/business/views/Source/SourceShifts.vue'),
            meta: { tab: 'source' },
          },
          {
            path: 'month',
            name: 'b.schedule.month',
            component: () => import('@/modules/business/views/Schedule/MonthSchedule.vue'),
            meta: { tab: 'schedule' },
          },
        ],
      },

      { path: 'new',           name: 'b.new',           component: () => import('@/modules/business/views/New.vue') },
      { path: 'reports',       name: 'b.reports',       component: () => import('@/modules/business/views/Reports.vue') },
      { path: 'notifications', name: 'b.notifications', component: () => import('@/modules/business/views/Notifications.vue') },
    ],
  },
]
