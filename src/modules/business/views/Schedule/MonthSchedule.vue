<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Calendar from '@/components/Calendar.vue'
import ShiftCard from '@/components/ShiftCard.vue'
import { useShiftsStore } from '@/modules/shared/stores/useShiftsStore'

const currentDate = ref(new Date())
const selectedDate = ref<Date | null>(null)

const auth = useAuth()
const store = useShiftsStore()

onMounted(() => {
  store.fetchMonthShifts(currentDate.value, auth.role || 'business')
})

watch(
  () => `${currentDate.value.getFullYear()}-${currentDate.value.getMonth()}`,
  () => store.fetchMonthShifts(currentDate.value, auth.role || 'business')
)

// Convert store data → days that have shifts (numbers like [1,7,9,...])
const datesWithShifts = computed<number[]>(() => {
  const y = currentDate.value.getFullYear()
  const m = currentDate.value.getMonth()
  // Assuming store has an array like [{ date: '2025-11-24', ... }, ...]
  const set = new Set<number>()
  for (const s of store.shifts) {
    const d = new Date(s.date) // s.date ISO like '2025-11-24'
    if (d.getFullYear() === y && d.getMonth() === m) set.add(d.getDate())
  }
  return Array.from(set).sort((a,b)=>a-b)
})

// Filter for the selected day (and whatever tab/filter logic you want)
const dayKey = computed(() =>
  selectedDate.value
    ? selectedDate.value.toISOString().slice(0,10)
    : null
)

const shiftsForSelectedDay = computed(() =>
  dayKey.value ? store.shifts.filter(s => s.date === dayKey.value) : []
)

// Calendar event handlers
function prevMonth() {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() - 1)
  currentDate.value = d
}
function nextMonth() {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() + 1)
  currentDate.value = d
}
function selectDate(d: Date) {
  selectedDate.value = d
}
</script>

<template>
  <div class="px-4 py-4">
    <Calendar
      :currentDate="currentDate"
      :selectedDate="selectedDate"
      :datesWithShifts="datesWithShifts"
      @prevMonth="prevMonth"
      @nextMonth="nextMonth"
      @selectDate="selectDate"
    />

    <section class="mt-4 space-y-3">
      <ShiftCard
        v-for="shift in shiftsForSelectedDay"
        :key="shift.id"
        :shift="shift"
      />
      <p v-if="!shiftsForSelectedDay.length" class="text-slate-400 text-center py-8">
        No shifts for the selected date.
      </p>
    </section>
  </div>
</template>
