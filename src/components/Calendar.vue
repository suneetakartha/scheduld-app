<!-- src/components/Calendar.vue  (or @/modules/shared/components/Calendar.vue if that's your path) -->
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentDate: Date
  selectedDate: Date | null
  datesWithShifts?: number[]
}>()

const emit = defineEmits<{
  (e: 'prevMonth'): void
  (e: 'nextMonth'): void
  (e: 'selectDate', d: Date): void
}>()

// Build a simple 6x7 grid for the month
const grid = computed(() => {
  const y = props.currentDate.getFullYear()
  const m = props.currentDate.getMonth()
  const start = new Date(y, m, 1)
  const end = new Date(y, m + 1, 0)
  const startDay = (start.getDay() + 6) % 7 // Mon=0

  const cells: Array<{ day: number | null }> = []
  for (let i = 0; i < startDay; i++) cells.push({ day: null })
  for (let d = 1; d <= end.getDate(); d++) cells.push({ day: d })
  while (cells.length < 42) cells.push({ day: null })
  return cells
})

function isSelected(day: number) {
  if (!props.selectedDate) return false
  return (
    props.selectedDate.getFullYear() === props.currentDate.getFullYear() &&
    props.selectedDate.getMonth() === props.currentDate.getMonth() &&
    props.selectedDate.getDate() === day
  )
}

function isToday(day: number) {
  const t = new Date()
  return (
    t.getFullYear() === props.currentDate.getFullYear() &&
    t.getMonth() === props.currentDate.getMonth() &&
    t.getDate() === day
  )
}

function hasShift(day: number) {
  return !!props.datesWithShifts?.includes(day)
}

function pick(day: number) {
  emit('selectDate', new Date(props.currentDate.getFullYear(), props.currentDate.getMonth(), day))
}
</script>

<template>
  <div class="w-full max-w-[360px] mx-auto">
    <!-- Week header -->
    <div class="grid grid-cols-7 text-center text-xs font-semibold text-slate-600">
      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
    </div>

    <!-- Month grid -->
    <div class="mt-2 grid grid-cols-7 gap-y-1">
      <button
        v-for="(cell, i) in grid"
        :key="i"
        class="h-8 w-8 mx-auto rounded-full text-sm grid place-items-center relative"
        :class="[
          cell.day === null
            ? 'opacity-0 pointer-events-none'
            : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200',
          cell.day && isSelected(cell.day) ? '!bg-blue-600 !text-white border-blue-600' : '',
          cell.day && !isSelected(cell.day) && isToday(cell.day) ? 'ring-2 ring-blue-300' : ''
        ]"
        @click="cell.day && pick(cell.day)"
      >
        <span v-if="cell.day !== null">{{ cell.day }}</span>
        <!-- tiny dot if the day has shifts -->
        <span
          v-if="cell.day && hasShift(cell.day)"
          class="absolute bottom-0.5 h-1.5 w-1.5 rounded-full"
          :class="isSelected(cell.day) ? 'bg-white/90' : 'bg-amber-400'"
        />
      </button>
    </div>

    <!-- Month controls (optional; you can place buttons outside too) -->
    <div class="flex items-center justify-between mt-3">
      <button
        type="button"
        class="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 text-xs"
        @click="$emit('prevMonth')"
      >
        Prev
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-700 text-xs"
        @click="$emit('nextMonth')"
      >
        Next
      </button>
    </div>
  </div>
</template>
