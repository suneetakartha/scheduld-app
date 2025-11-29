// src/modules/shared/stores/useShiftsStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Role = 'worker' | 'business'
export type Tab  = 'source' | 'schedule'
export type ShiftOrigin = 'source' | 'schedule'

export type Shift = {
  id: number | string
  date: string         // 'YYYY-MM-DD'
  start?: string       // '10:00'
  end?: string         // '15:00'
  site?: string
  position?: string
  workerName?: string
  wage?: number
  earnings?: number
  avatar?: string
  past?: boolean
  origin: ShiftOrigin  // <-- NEW
}
type FetchArgs =
  | { role: Role; month?: string }     // YYYY-MM (preferred)
  | { role: Role; start?: string; end?: string } // YYYY-MM-DD range

export const useShiftsStore = defineStore('shifts', () => {
  const tab   = ref<Tab>('source')
  const title = ref<string>('Upcoming Shifts')
  const shifts = ref<Shift[]>([])

  // ------- getters / derived -------
  /** Map of date -> Shift[] for easy lookups in views */
  const byDate = computed(() => {
    const m = new Map<string, Shift[]>()
    for (const s of shifts.value) {
      const k = s.date
      if (!m.has(k)) m.set(k, [])
      m.get(k)!.push(s)
    }
    return m
  })

  /** Convenience getter: all dates that currently have shifts */
  const datesWithShifts = computed<number[]>(() => {
    // gather unique day numbers (1..31) from the current shifts set
    const set = new Set<number>()
    for (const s of shifts.value) {
      const d = new Date(s.date)
      if (!isNaN(d.getTime())) set.add(d.getDate())
    }
    return Array.from(set).sort((a, b) => a - b)
  })
 function byDateAndOrigin(date: string, origin: ShiftOrigin) {
    return shifts.value.filter(s => s.date === date && s.origin === origin)
  }
  function byOrigin(origin: ShiftOrigin) {
    return shifts.value.filter(s => s.origin === origin)
  }
  // ------- actions -------
  function setTab(next: Tab) {
    tab.value = next
    // Optional: adjust title based on tab
    title.value = next === 'source' ? 'Upcoming Shifts' : 'SwipeSchedule'
  }

  function setTitle(next: string) {
    title.value = next
  }

  /**
   * Fetch shifts for the current role/month (or range).
   * Replace the mock with a real API call as you wire up your backend.
   */
  async function fetchShifts(args: FetchArgs) {
    // Example: you might call something like:
    // const { data } = await axios.get('/api/shifts', { params: args })
    // shifts.value = data

    // ---- Mock data (works for both roles) ----
    const baseMonth = '2025-12'
    const sample: Shift[] = [
      // upcoming
      {
        id: 1,
        date: `${baseMonth}-24`,
        start: '10:00',
        end: '15:00',
        site: 'Site 1',
        position: 'Bartender',
        workerName: 'Maddie Byrd',
        wage: 25,
        earnings: 106.25,
        avatar: 'https://app.codigma.io/api/uploads/assets/498cb9f8-ce1f-4e2e-a0c9-d2aeec4b4383.svg',
        past: false,
        origin: 'source',
      },
      {
        id: 2,
        date: `${baseMonth}-25`,
        start: '09:00',
        end: '17:00',
        site: 'Site 2',
        position: 'Server',
        workerName: 'Jay Dunn',
        wage: 22,
        earnings: 176,
        avatar: 'https://placehold.co/48',
        past: false,
        origin: 'schedule',
      },
      // past
      {
        id: 3,
        date: `${baseMonth}-10`,
        start: '08:00',
        end: '12:00',
        site: 'Site 3',
        position: 'Host',
        workerName: 'Alex Kim',
        wage: 20,
        earnings: 80,
        avatar: 'https://placehold.co/48',
        past: true,
        origin: 'schedule',
      },
    ]

  
    let filtered = sample
    if ('month' in args && args.month) {
      filtered = sample.filter(s => s.date.startsWith(args.month))
    } else if ('start' in args && args.start && args.end) {
      const start = new Date(args.start)
      const end   = new Date(args.end)
      filtered = sample.filter(s => {
        const d = new Date(s.date)
        return d >= start && d <= end
      })
    }



    shifts.value = filtered
  }

  /**
   * Convenience: fetch for a Date object (converts to YYYY-MM).
   * Useful from Month views.
   */
  async function fetchMonthShifts(current: Date, role: Role) {
    const ym = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`
    return fetchShifts({ role, month: ym })
  }

  return {
    // state
    tab, title, shifts,
    // derived
    byDate, datesWithShifts, byDateAndOrigin, byOrigin,
    // actions
    setTab, setTitle, fetchShifts, fetchMonthShifts,
  }
})
