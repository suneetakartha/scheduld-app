<template>
  <nav
    class="w-full bg-white shadow-[0_-4px_6px_0_rgba(0,0,0,0.10)] inline-flex justify-between items-center"
    aria-label="Bottom navigation"
  >
    <button
      v-for="t in tabs"
      :key="t.key"
      type="button"
      :aria-current="modelValue === t.key ? 'page' : undefined"
      @click="onSelect(t.key)"
      :class="[
        'flex-1 py-1.5 inline-flex flex-col justify-end items-center transition-colors',
        modelValue === t.key ? 'bg-neutral-100' : 'bg-white'
      ]"
    >
      <i :class="['pi', t.icon, modelValue === t.key ? 'text-black' : 'text-slate-400', 'text-[20px] leading-none']" />
      <span :class="['text-[8px] font-medium mt-0.5', modelValue === t.key ? 'text-black' : 'text-slate-400']">
        {{ t.label }}
      </span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import 'primeicons/primeicons.css'
import { computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

type Role = 'worker' | 'business'
type TabKey = 'home' | 'shifts' | 'new' | 'reports' | 'notifications'

const tabs: ReadonlyArray<{ key: TabKey; label: string; icon: string }> = [
  { key: 'home',          label: 'Home',          icon: 'pi-home' },
  { key: 'shifts',        label: 'Shifts',        icon: 'pi-user-plus' },
  { key: 'new',           label: 'New',           icon: 'pi-plus' },
  { key: 'reports',       label: 'Reports',       icon: 'pi-chart-bar' },
  { key: 'notifications', label: 'Notifications', icon: 'pi-bell' },
]

/**
 * Props:
 * - modelValue: which tab is active (v-model)
 * - routes: optional explicit mapping for tabs -> route locations (overrides defaults)
 * - role: which namespace to use for defaults ('w.*' or 'b.*')
 */
const props = withDefaults(defineProps<{
  modelValue?: TabKey
  routes?: Partial<Record<TabKey, string | { name: string }>>
  role?: Role
}>(), {
  modelValue: 'home',
  role: 'worker',
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: TabKey): void
  (e: 'select', v: TabKey): void
}>()

// Default per-role named routes (can be overridden via props.routes)
const defaultRoutes = computed<Record<TabKey, { name: string }>>(() => {
  const p = props.role === 'business' ? 'b' : 'w'
  return {
    home:          { name: `${p}.home` },
    shifts:        { name: `${p}.shifts` },
    new:           { name: `${p}.shifts` },      // or `${p}.new` if you add one
    reports:       { name: `${p}.reports` },
    notifications: { name: `${p}.notifications` },
  }
})

// Final routes = defaults merged with user overrides
const resolvedRoutes = computed(() => ({ ...defaultRoutes.value, ...props.routes }))

const router = useRouter()
const route = useRoute()

function onSelect(k: TabKey) {
  emit('update:modelValue', k)
  emit('select', k)
  const dest = resolvedRoutes.value[k]
  if (!dest) return
  typeof dest === 'string' ? router.push(dest) : router.push(dest)
}

// Keep the active tab in sync when the URL changes (e.g., back/forward)
watch(
  () => route.name,
  (name) => {
    if (typeof name !== 'string') return
    const isWorker = name.startsWith('w.')
    const isBusiness = name.startsWith('b.')
    const map: Record<string, TabKey | undefined> = {
      [`${isWorker ? 'w' : 'b'}.home`]: 'home',
      [`${isWorker ? 'w' : 'b'}.shifts`]: 'shifts',
      [`${isWorker ? 'w' : 'b'}.reports`]: 'reports',
      [`${isWorker ? 'w' : 'b'}.notifications`]: 'notifications',
      // add `${p}.new` → 'new' if/when you create that route
    }
    const key = map[name]
    if (key && key !== props.modelValue) emit('update:modelValue', key)
  },
  { immediate: true }
)
</script>
