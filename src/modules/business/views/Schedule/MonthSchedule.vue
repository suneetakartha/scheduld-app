<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuth } from '@/modules/shared/stores/useAuth'
import { useShiftsStore, type Shift } from '@/modules/shared/stores/useShiftsStore'
import Calendar from '@/components/Calendar.vue'
import ShiftCard from '@/components/ShiftCard.vue'

// stores
const auth  = useAuth()
const store = useShiftsStore()
const { datesWithShifts } = storeToRefs(store)

// calendar state
const currentDate  = ref(new Date())
const selectedDate = ref<Date | null>(null)

// month label (optional, if you show one)
const monthLabel = computed(() =>
  currentDate.value.toLocaleString(undefined, { month: 'long', year: 'numeric' })
)

// fetch month when the visible month changes
async function fetchMonth() {
  await store.fetchMonthShifts(currentDate.value, auth.role || 'business')
  // pick a sensible default (first day in the month that has shifts)
  const days = datesWithShifts.value
  if (days.length) {
    selectedDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth(),
      days[0]
    )
  } else {
    selectedDate.value = null
  }
}

onMounted(fetchMonth)
watch(
  () => `${currentDate.value.getFullYear()}-${currentDate.value.getMonth()}`,
  fetchMonth
)

// calendar controls
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

// list for selected calendar day (both origins shown here; filter if desired)
const listForDay = computed<Shift[]>(() => {
  if (!selectedDate.value) return []
  const iso = `${selectedDate.value.getFullYear()}-${String(selectedDate.value.getMonth()+1).padStart(2,'0')}-${String(selectedDate.value.getDate()).padStart(2,'0')}`
  return store.byDate.get(iso) ?? []
})
</script>

<template>
  <div class="h-full overflow-y-auto bg-[#F6F6F6] p-4 space-y-4">
    <h2 class="text-base font-semibold text-slate-800">{{ monthLabel }}</h2>

    <Calendar
      :currentDate="currentDate"
      :selectedDate="selectedDate"
      :datesWithShifts="datesWithShifts"
      @prevMonth="prevMonth"
      @nextMonth="nextMonth"
      @selectDate="selectDate"
    />

    <section class="space-y-3 mt-2">
      <ShiftCard
        v-for="s in listForDay"
        :key="s.id"
        :site="s.site || 'Site'"
        :shiftTitle="s.position || 'Shift'"
        :avatarUrl="s.avatar"
        :dateLabel="new Date(s.date).toLocaleDateString()"
        :timeLabel="s.start && s.end ? `${s.start} – ${s.end}` : ''"
        :staffedLabel="s.past ? 'Completed' : 'Upcoming'"
        checklistLabel="Set up Prep Checklist"
      />
      <p v-if="!listForDay.length" class="text-center text-gray-400 py-6">
        No shifts for the selected day.
      </p>
    </section>
  </div>
</template>
