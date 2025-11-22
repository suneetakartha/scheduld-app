import { defineStore } from 'pinia'
type Role = 'worker' | 'business' | null

export const useAuth = defineStore('auth', {
  state: () => ({ user: null as null | { id: string; role: Role } }),
  getters: {
    role: (s) => s.user?.role ?? null,
    isAuthed: (s) => !!s.user,
  },
  actions: {
    loginAs(role: Exclude<Role, null>) {
      this.user = { id: 'demo', role }
    },
    logout() { this.user = null },
  },
})
