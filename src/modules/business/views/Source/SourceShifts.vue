<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuth } from '@/modules/shared/stores/useAuth'
import { useShiftsStore, type Shift } from '@/modules/shared/stores/useShiftsStore'
import ShiftCard from '@/components/ShiftCard.vue'

const auth  = useAuth()
const store = useShiftsStore()
const { tab, shifts } = storeToRefs(store)

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const selectedDate = ref<string>('')

function setSelectedDateToNextSourceDay() {
  const today = new Date()
  const end   = new Date(today); end.setDate(end.getDate() + 30)
  const available = new Set(store.byOrigin('source').map(s => s.date))
  console.debug('[SourceShifts] available source dates:', Array.from(available))

  for (let d = new Date(today); d <= end; d.setDate(d.getDate() + 1)) {
    const iso = toISO(d)
    if (available.has(iso)) {
      selectedDate.value = iso
      console.debug('[SourceShifts] selectedDate set to', selectedDate.value)
      return
    }
  }
  selectedDate.value = toISO(today)
}

// Ensure we have data, then pick a default day
onMounted(async () => {
  if (!shifts.value.length) {
    await store.fetchMonthShifts(new Date(), auth.role || 'business')
  }
  // Make sure the store tab reflects Source
  store.setTab('source')
  setSelectedDateToNextSourceDay()
})

// If someone flips the tab while on this child route, keep source behavior
watch(tab, (t) => {
  if (t !== 'source') store.setTab('source')
})

// ✅ SOURCE list only
const sourceList = computed<Shift[]>(() => {
  if (!selectedDate.value) return []
  return store.byDateAndOrigin(selectedDate.value, 'source')
})
</script>


<template>
  <div class="space-y-2">
    <h2 class="text-sm text-gray-600">Source — {{ selectedDate || '—' }}</h2>

    <ShiftCard
      v-for="s in sourceList"
      :key="s.id"
      :site="s.site || 'Site'"
      :shiftTitle="s.position || 'Shift'"
      :avatarUrl="s.avatar"
      :dateLabel="new Date(s.date).toLocaleDateString()"
      :timeLabel="s.start && s.end ? `${s.start} – ${s.end}` : ''"
      :staffedLabel="s.past ? 'Completed' : 'Upcoming'"
      checklistLabel="Set up Prep Checklist"
    />

    <p v-if="!sourceList.length" class="text-center text-gray-400 py-8">
      No source shifts for {{ selectedDate || 'the selected date' }}.
    </p>
  </div>
</template>
