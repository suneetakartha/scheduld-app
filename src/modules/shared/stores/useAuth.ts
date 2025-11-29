import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Role = 'worker' | 'business' | null

const LS_KEY = 'auth.v1' // bump this if you ever need to invalidate old sessions

type SavedAuth = {
  token: string | null
  role: Role
}

export const useAuth = defineStore('auth', () => {
  // ---- state ----
  const token = ref<string | null>(null)
  const role  = ref<Role>(null)

  // ---- getters ----
  // If you gate by role, it’s safest to require both token AND role.
  const isAuthenticated = computed(() => !!token.value && !!role.value)

  // ---- actions ----
  function loginAs(nextRole: Exclude<Role, null>, fakeToken?: string) {
    role.value  = nextRole
    token.value = fakeToken ?? 'dev-token' // replace with real token from your API
    persist()
  }

  function loginWithToken(nextToken: string, nextRole: Exclude<Role, null>) {
    token.value = nextToken
    role.value  = nextRole
    persist()
  }

  function setToken(next: string | null) {
    token.value = next
    persist()
  }

  function setRole(next: Role) {
    role.value = next
    persist()
  }

  function logout() {
    token.value = null
    role.value  = null
    persist()
  }

  /** Load saved session once at app start */
  function restoreFromStorage() {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (!raw) return
      const saved: SavedAuth = JSON.parse(raw)
      token.value = saved?.token ?? null
      role.value  = saved?.role  ?? null
    } catch {
      // ignore parse errors
    }
  }

  /** Keep tabs/windows in sync */
  function bindStorageSync() {
    window.addEventListener('storage', (e) => {
      if (e.key !== LS_KEY) return
      try {
        const saved: SavedAuth = e.newValue ? JSON.parse(e.newValue) : { token: null, role: null }
        token.value = saved?.token ?? null
        role.value  = saved?.role  ?? null
      } catch {
        // ignore
      }
    })
  }

  function persist() {
    const payload: SavedAuth = { token: token.value, role: role.value }
    localStorage.setItem(LS_KEY, JSON.stringify(payload))
  }

  return {
    // state
    token, role,
    // getters
    isAuthenticated,
    // actions
    loginAs, loginWithToken, setToken, setRole, logout,
    restoreFromStorage, bindStorageSync,
  }
})
