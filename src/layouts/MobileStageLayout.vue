<!-- src/layouts/MobileStageLayout.vue -->
<template>
  <MobileStage :headerHeight="64" :footerHeight="64">
    <!-- Header (persistent) -->
    <template #header>
      <HeaderBar
        avatarSrc="/brand/avatar.svg"
        @avatar="menuOpen = true"
        @logo="onLogo"
      />
    </template>

    <!-- Scrollable page content -->
    <div class="h-full">
      <router-view />
    </div>

    <!-- Persistent bottom NavBar -->
    <template #footer>
      <NavBar
        v-model="tab"
        :role="role || 'worker'"
        :routes="defaultRoutes"
        @select="onSelect"
      />
    </template>

    <!-- Slide-out side menu -->
    <SideMenu v-model:open="menuOpen" />
  </MobileStage>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import MobileStage from '@/components/MobileStage.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import NavBar from '@/components/NavBar.vue'
import SideMenu from '@/components/SideMenu.vue'
import { useAuth } from '@/modules/shared/stores/useAuth'

type TabKey = 'home' | 'shifts' | 'new' | 'reports' | 'notifications'

const tab = ref<TabKey>('home')
const menuOpen = ref(false)

const router = useRouter()
const route = useRoute()
const auth = useAuth()
const { role } = storeToRefs(auth)

const defaultRoutes = computed(() => {
  const p = role.value === 'business' ? 'b' : 'w'
  return {
    home:          { name: `${p}.home` },
    shifts:        { name: `${p}.shifts` },
    new:           { name: `${p}.shifts` }, // update when you add `${p}.new`
    reports:       { name: `${p}.reports` },
    notifications: { name: `${p}.notifications` },
  }
})

watch(
  () => route.name,
  (name) => {
    if (typeof name !== 'string') return
    const base = name.startsWith('b.')
      ? 'b'
      : name.startsWith('w.')
      ? 'w'
      : null
    if (!base) return

    const map: Record<string, TabKey> = {
      [`${base}.home`]: 'home',
      [`${base}.shifts`]: 'shifts',
      [`${base}.reports`]: 'reports',
      [`${base}.notifications`]: 'notifications',
    }

    const k = map[name]
    if (k && k !== tab.value) tab.value = k
  },
  { immediate: true }
)

function onSelect(k: TabKey) {
  const dest = defaultRoutes.value[k]
  if (dest) router.push(dest)
}

// optional: do something when logo is clicked (e.g. go home)
function onLogo() {
  const p = role.value === 'business' ? 'b' : 'w'
  router.push({ name: `${p}.home` })
}
</script>
