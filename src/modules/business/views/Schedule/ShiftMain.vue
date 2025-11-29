<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuth } from '@/modules/shared/stores/useAuth'
import { useShiftsStore, type Shift } from '@/modules/shared/stores/useShiftsStore'
import ShiftCard from '@/components/ShiftCard.vue'

type Tab = 'source' | 'schedule'

const auth  = useAuth()
const store = useShiftsStore()
const { tab } = storeToRefs(store)           // uses store.tab you already have

// choose a day (wire this to your calendar later)
// Default is computed from store: earliest date within the upcoming week that
// has shifts for the active tab. Falls back to today if nothing found.
const selectedDate = ref<string>('')

function formatISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`
}

function setSelectedDateToNextActiveDay() {
  const today = new Date()
  const end = new Date(today)
  end.setDate(today.getDate() + 6) // upcoming 7 days including today

  // collect dates that have shifts for the current tab/origin
  const shiftsForOrigin = store.byOrigin(tab.value as any)
  const available = new Set(shiftsForOrigin.map((s: any) => s.date))

  for (let d = new Date(today); d <= end; d.setDate(d.getDate() + 1)) {
    const iso = formatISO(d)
    if (available.has(iso)) {
      selectedDate.value = iso
      return
    }
  }

  // fallback — today's ISO
  selectedDate.value = formatISO(today)
}

// fetch for the month once
onMounted(async () => {
  await store.fetchMonthShifts(new Date(), auth.role || 'business')
  // set default selectedDate after data is loaded
  setSelectedDateToNextActiveDay()
})

// Recompute default selected date when the tab changes
watch(
  () => tab.value,
  () => {
    // If there are shifts for the new tab, pick the next active day.
    setSelectedDateToNextActiveDay()
  }
)

// filter by selected date + current tab (origin)
const listForTab = computed<Shift[]>(() => {
  return store.byDateAndOrigin(selectedDate.value, tab.value)
})

// let the tab buttons drive the store tab
function setTab(next: Tab) {
  store.setTab(next)
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

    <h2 class="text-sm text-gray-600">Shifts — {{ selectedDate }} ({{ tab }})</h2>

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
      No {{ tab }} shifts for {{ selectedDate }}.
    </p>
  </div>
</template>
