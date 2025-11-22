// src/modules/shared/stores/useUserStore.ts
import { defineStore } from 'pinia'

type Profile = {
  name: string
  avatar: string
}

type BusinessInfo = {
  name: string
  logo: string
  rating: number
  reviews: number
}

type WorkerInfo = {
  title: string
  rating: number
  shiftsCompleted: number
}

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: {
      name: 'Kam Johnson',
      avatar: 'https://placehold.co/40x40',
    } as Profile,

    // only populated when logged in as business
    business: null as BusinessInfo | null,

    // only populated when logged in as worker
    worker: null as WorkerInfo | null,
  }),

  getters: {
    hasBusiness: (s) => !!s.business,
    hasWorker: (s) => !!s.worker,
  },

  actions: {
    setProfile(p: Partial<Profile>) {
      this.profile = { ...this.profile, ...p }
    },
    setBusiness(b: BusinessInfo | null) {
      this.business = b
    },
    setWorker(w: WorkerInfo | null) {
      this.worker = w
    },
    clearAll() {
      this.profile = { name: '', avatar: '' }
      this.business = null
      this.worker = null
    },
  },
})
