<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/modules/shared/stores/useAuth'
import { useShiftsStore, type Shift } from '@/modules/shared/stores/useShiftsStore'
import ShiftCard from '@/components/ShiftCard.vue'

const auth  = useAuth()
const store = useShiftsStore()

// optional: show a single date, or set to null to list all
const selectedDate = ref<string | null>(null)

onMounted(async () => {
  await store.fetchMonthShifts(new Date(), auth.role || 'business')
})

const sourceShifts = computed<Shift[]>(() => {
  return selectedDate.value
    ? store.byDateAndOrigin(selectedDate.value, 'source')
    : store.byOrigin('source')
})
</script>

<template>
  <div class="h-full overflow-y-auto bg-[#F6F6F6] p-4 space-y-3">
    <h2 class="text-sm text-gray-600">
      SwipeSource Shifts <span v-if="selectedDate">— {{ selectedDate }}</span>
    </h2>

    <ShiftCard v-for="s in sourceShifts" :key="s.id" :shift="s" />

    <p v-if="!sourceShifts.length" class="text-center text-gray-400 py-8">
      No source shifts to show.
    </p>
  </div>
</template>
