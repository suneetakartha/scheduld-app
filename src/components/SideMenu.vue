<template>
  <transition name="fade-fast">
    <div
      v-if="open"
      class="absolute inset-0 z-50 pointer-events-none"
      role="dialog"
      aria-modal="true"
    >
      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-black/30 pointer-events-auto"
        @click="close"
      />

      <!-- Sliding panel -->
      <transition name="slide-left">
        <aside
          class="absolute left-0 top-0 h-full w-[281px] bg-gray-50 shadow-2xl flex flex-col pointer-events-auto"
        >
          <!-- Header: user -->
          <header class="pt-10 pb-2 px-4">
            <div class="flex items-center gap-3">
              <img
                :src="profile.avatar || fallbackAvatar"
                alt="Avatar"
                class="w-[42px] h-[42px] rounded-full object-cover bg-gray-200 border shadow"
              />
              <div class="flex flex-col gap-0.5 mt-1">
                <p class="text-gray-900 text-base font-medium leading-tight tracking-wide">
                  {{ profile.name || 'User' }}
                </p>
                <button
                  type="button"
                  class="flex items-center gap-1.5 text-gray-400 text-xs font-medium mt-0.5 outline-none focus:ring-2 focus:ring-indigo-200 rounded"
                >
                  <span>Account Settings</span>
                  <i class="pi pi-chevron-right text-xs" />
                </button>
              </div>
            </div>
            <hr class="border-t border-gray-200 mt-5" />
          </header>

          <!-- Main content -->
          <main class="flex-grow px-4 overflow-y-auto pb-24">
            <!-- Business card (only if we have one) -->
            <section v-if="business" class="mt-8 mb-6">
              <h2 class="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                Your Business
              </h2>

              <div class="bg-white rounded-lg shadow px-4 py-3 flex gap-3 items-start">
                <img
                  :src="business.logo || fallbackBizLogo"
                  alt="Business icon"
                  class="w-10 h-10 rounded bg-gray-100 object-contain"
                />
                <div class="flex flex-col gap-0.5 mt-1 flex-1 min-w-0">
                  <div class="flex items-center justify-between w-full gap-1">
                    <span class="font-medium text-base text-gray-800 truncate max-w-[110px]">
                      {{ business.name }}
                    </span>
                    <span class="flex items-center gap-1 text-xs font-medium text-gray-500 ml-2">
                      <i class="pi pi-star text-xs" />
                      {{ business.rating }} ({{ business.reviews }})
                    </span>
                  </div>
                  <button
                    type="button"
                    class="flex items-center gap-1 text-xs text-gray-400 font-normal mt-0.5 hover:underline focus:outline-none"
                    @click="onViewBusiness"
                  >
                    <span>View Profile</span>
                    <i class="pi pi-chevron-right text-xs" />
                  </button>
                </div>

                <button
                  type="button"
                  class="ml-3 w-[23px] h-[23px] flex items-center justify-center opacity-80 hover:bg-gray-100 rounded transition"
                  @click="onBusinessMore"
                >
                  <i class="pi pi-ellipsis-v text-sm" />
                </button>
              </div>
            </section>

            <!-- Manage menu -->
            <nav class="mt-8 mb-4">
              <h3 class="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                Manage
              </h3>
              <ul class="flex flex-col gap-0.5">
                <li
                  v-for="item in menuItems"
                  :key="item.key"
                  tabindex="0"
                  class="flex items-center gap-3 text-sm font-medium text-gray-800 py-2 px-2 rounded-lg transition-colors cursor-pointer hover:bg-gray-200 focus:bg-gray-100 outline-none"
                  @click="go(item.key)"
                  @keydown.enter="go(item.key)"
                >
                  <i :class="['pi', item.icon, 'text-[14px] opacity-80']" />
                  <span>{{ item.label }}</span>
                </li>
              </ul>
            </nav>
          </main>

          <!-- Footer actions -->
          <footer class="absolute bottom-0 w-full left-0 px-4 pb-5 pt-3 bg-gradient-to-t from-gray-50/95 to-gray-50">
            <button
              type="button"
              class="flex items-center gap-3 text-sm text-gray-800 py-2 px-2 rounded hover:bg-gray-100 focus:outline-none"
              @click="onSwitchAccount"
            >
              <i class="pi pi-refresh text-[15px]" />
              <span>Switch to Worker Account</span>
            </button>

            <button
              type="button"
              class="flex items-center gap-3 text-sm text-gray-800 py-2 px-2 rounded hover:bg-gray-100 focus:outline-none"
              @click="onContactSupport"
            >
              <i class="pi pi-life-ring text-[15px]" />
              <span>Contact Support</span>
            </button>

            <button
              type="button"
              class="flex items-center gap-3 text-sm font-semibold py-2 px-2 rounded hover:bg-gray-100 focus:outline-none text-red-600"
              @click="onLogout"
            >
              <i class="pi pi-sign-out text-[15px]" />
              <span>Log Out</span>
            </button>
          </footer>
        </aside>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import 'primeicons/primeicons.css'

import { useUserStore } from '@/modules/shared/stores/useUserStore'
import { useAuth } from '@/modules/shared/stores/useAuth'

const props = defineProps<{
  open: boolean
  closeOnEsc?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const router = useRouter()
const auth = useAuth()
const userStore = useUserStore()
const { profile, business } = storeToRefs(userStore)

const fallbackAvatar = 'https://placehold.co/42'
const fallbackBizLogo = 'https://placehold.co/40'

type MenuKey = 'business' | 'team' | 'sites' | 'positions' | 'shifts'

const menuItems: Array<{ key: MenuKey; label: string; icon: string }> = [
  { key: 'business',  label: 'Business',  icon: 'pi-building' },
  { key: 'team',      label: 'Team',      icon: 'pi-users' },
  { key: 'sites',     label: 'Sites',     icon: 'pi-map' },
  { key: 'positions', label: 'Positions', icon: 'pi-briefcase' },
  { key: 'shifts',    label: 'Shifts',    icon: 'pi-calendar' },
]

function close() {
  emit('update:open', false)
}

function go(key: MenuKey) {
  const p = auth.role === 'business' ? 'b' : 'w'

  switch (key) {
    case 'shifts':
      router.push({ name: `${p}.shifts` })
      break
    case 'business':
      console.log('Go to Business')
      break
    case 'team':
      console.log('Go to Team')
      break
    case 'sites':
      console.log('Go to Sites')
      break
    case 'positions':
      console.log('Go to Positions')
      break
  }

  close()
}

function onKeydown(e: KeyboardEvent) {
  if (!props.open) return
  if (props.closeOnEsc !== false && e.key === 'Escape') {
    close()
  }
}

// footer actions — plug in real behavior when ready
function onViewBusiness() {
  console.log('View business profile')
}
function onBusinessMore() {
  console.log('More business actions')
}
function onSwitchAccount() {
  console.log('Switch account (business <-> worker)')
}
function onContactSupport() {
  console.log('Contact support')
}
function onLogout() {
  auth.logout?.()
  console.log('Log out')
  close()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.15s ease;
}
.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.2s ease;
}
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}
</style>
