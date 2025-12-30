<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ShiftCard from '@/components/ShiftCard.vue'

type Tab = 'source' | 'schedule'

// Shape coming back from /api/shifts
type ShiftFromApi = {
  id: string
  shiftstart_datetime: string
  shiftend_datetime: string
  site_id: string
  position_id: string
  worker_id: string
  wage: number
  earnings: number
  avatar: string
  origin: string
}

// Shape used by this view + template (what your ShiftCard props currently assume)
type ShiftCardModel = {
  id: string
  site: string
  position: string
  avatar: string | undefined
  date: string            // 'YYYY-MM-DD'
  start: string           // e.g. '10:00 AM'
  end: string             // e.g. '3:00 PM'
  past: boolean
  origin: string
}

const router = useRouter()
const route  = useRoute()

// local tab state
const tab = ref<Tab>('schedule')

// all shifts from API
const allShifts = ref<ShiftFromApi[]>([])
const loading   = ref(true)
const error     = ref<string | null>(null)

const selectedDate = ref<string>('')

// ---------- helpers ----------

function formatISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function dateISOFromShiftstart(s: ShiftFromApi): string {
  const d = new Date(s.shiftstart_datetime)
  return formatISO(d)
}

function formatTime(d: Date) {
  return d.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

// map API shift -> model used in template
function mapShiftToCardModel(s: ShiftFromApi): ShiftCardModel {
  const start = new Date(s.shiftstart_datetime)
  const end   = new Date(s.shiftend_datetime)
  const now   = new Date()

  return {
    id: s.id,
    site: s.site_id || 'Site',
    position: s.position_id || 'Shift',
    avatar: s.avatar,
    date: dateISOFromShiftstart(s),
    start: formatTime(start),
    end: formatTime(end),
    past: end < now,
    origin: s.origin,
  }
}

// treat ANY child under /b/shifts as “child active”
const isChildActive = computed(() => {
  const name = route.name as string | undefined
  return !!name && (name === 'b.schedule.source' || name === 'b.schedule.month')
})

// default selected day = next day (within 30 days) that has shifts for current tab
function setSelectedDateToNextActiveDay() {
  const today = new Date()
  const end = new Date(today)
  end.setDate(today.getDate() + 30)

  const shiftsForOrigin = allShifts.value.filter(s => s.origin === tab.value)
  const available = new Set(shiftsForOrigin.map(dateISOFromShiftstart))

  for (let d = new Date(today); d <= end; d.setDate(d.getDate() + 1)) {
    const iso = formatISO(d)
    if (available.has(iso)) {
      selectedDate.value = iso
      return
    }
  }
  selectedDate.value = formatISO(today)
}

// keep tab in sync with route (so /b/shifts loads “schedule”, /b/shifts/source loads “source”)
function tabFromRoute(): Tab {
  return route.name === 'b.schedule.source' ? 'source' : 'schedule'
}

// fetch from backend API
async function fetchShiftsFromApi() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('/api/shifts')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    allShifts.value = data as ShiftFromApi[]
  } catch (e: any) {
    error.value = e?.message ?? 'Failed to load shifts'
    allShifts.value = []
  } finally {
    loading.value = false
  }
}

// initial fetch + tab sync
onMounted(async () => {
  tab.value = tabFromRoute()
  await fetchShiftsFromApi()
  setSelectedDateToNextActiveDay()
})

// when route changes, keep tab aligned
watch(
  () => route.name,
  () => {
    const next = tabFromRoute()
    if (next !== tab.value) {
      tab.value = next
      setSelectedDateToNextActiveDay()
    }
  },
)

// when tab changes (via buttons), update date as well
watch(tab, () => setSelectedDateToNextActiveDay())

// list by selected day + origin, in the shape the template expects
const listForTab = computed<ShiftCardModel[]>(() => {
  if (!selectedDate.value) return []
  return allShifts.value
    .filter(s => s.origin === tab.value && dateISOFromShiftstart(s) === selectedDate.value)
    .map(mapShiftToCardModel)
})

// tab buttons also drive navigation
function setTab(next: Tab) {
  if (next === tab.value) return
  tab.value = next
  if (next === 'source') {
    router.push({ name: 'b.schedule.source' })
  } else {
    router.push({ name: 'b.shifts' }) // parent shell
  }
}
</script>

<template>
  <div class="h-full overflow-y-auto bg-[#F6F6F6] p-4 space-y-3">
    <!-- Tabs -->
    <div class="flex bg-[#EFF2F1] rounded-lg overflow-hidden">
      <button
        class="flex-1 py-2 font-medium"
        :class="tab === 'schedule' ? 'text-[#4466A8] border-b-2 border-[#4466A8]' : 'text-gray-500'"
        @click="setTab('schedule')"
      >
        Schedule
      </button>
      <button
        class="flex-1 py-2 font-medium"
        :class="tab === 'source' ? 'text-[#4466A8] border-b-2 border-[#4466A8]' : 'text-gray-500'"
        @click="setTab('source')"
      >
        Source
      </button>
    </div>

    <!-- If a child route is active (source or month), render it; else show main list -->
    <router-view v-if="isChildActive" />

    <template v-else>
      <h2 class="text-sm text-gray-600">
        Shifts — {{ selectedDate || '—' }} ({{ tab }})
      </h2>

      <div v-if="loading" class="text-center text-gray-400 py-8">
        Loading shifts…
      </div>

      <div v-else-if="error" class="text-center text-red-500 py-8">
        {{ error }}
      </div>

      <template v-else>
        <ShiftCard
          v-for="s in listForTab"
          :key="s.id"
          :site="s.site || 'Site'"
          :shiftTitle="s.position || 'Shift'"
          :avatarUrl="s.avatar"
          :dateLabel="new Date(s.date).toLocaleDateString()"
          :timeLabel="s.start && s.end ? `${s.start} – ${s.end}` : ''"
          :staffedLabel="s.past ? 'Completed' : 'Upcoming'"
          checklistLabel="Set up Prep Checklist"
        />

        <p v-if="!listForTab.length" class="text-center text-gray-400 py-8">
          No {{ tab }} shifts for {{ selectedDate || 'the selected date' }}.
        </p>

        <div class="mt-4">
          <button
            type="button"
            class="px-3 py-2 bg-[#4466A8] text-white rounded"
            @click="$router.push({ name: 'b.schedule.month' })"
          >
            View month
          </button>
        </div>
      </template>
    </template>
  </div>
</template>
