// src/modules/shared/stores/useShiftsStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Role = 'worker' | 'business'
export type Tab  = 'source' | 'schedule'
export type ShiftOrigin = 'source' | 'schedule'

export type Shift = {
  id: number | string
  date: string         // 'YYYY-MM-DD'
  start?: string
  end?: string
  site?: string
  position?: string
  workerName?: string
  wage?: number
  earnings?: number
  avatar?: string
  past?: boolean
  origin: ShiftOrigin
}

type FetchArgs =
  | { role: Role; month?: string }                     // YYYY-MM
  | { role: Role; start?: string; end?: string }       // YYYY-MM-DD range

export const useShiftsStore = defineStore('shifts', () => {
  const tab    = ref<Tab>('source')
  const title  = ref<string>('Upcoming Shifts')
  const shifts = ref<Shift[]>([])

  // --------- derived ----------
  const byDate = computed(() => {
    const m = new Map<string, Shift[]>()
    for (const s of shifts.value) {
      const k = s.date
      if (!m.has(k)) m.set(k, [])
      m.get(k)!.push(s)
    }
    return m
  })

  const datesWithShifts = computed<number[]>(() => {
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

  // --------- actions ----------
  function setTab(next: Tab) {
    tab.value = next
    title.value = next === 'source' ? 'Upcoming Shifts' : 'SwipeSchedule'
  }
  function setTitle(next: string) {
    title.value = next
  }

  async function fetchShifts(args: FetchArgs) {
    // NOTE: args.role is currently unused; keep for future filtering.

    // --- month base ---
    const today = new Date()
    const y = today.getFullYear()
    const m = today.getMonth() + 1
    const pad = (n: number) => String(n).padStart(2, '0')
    const baseMonth = ('month' in args && args.month && args.month) ? args.month : `${y}-${pad(m)}`

    // helper to create YYYY-MM-DD in current fetch month
    const iso = (day: number) => `${baseMonth}-${pad(day)}`
    const rand = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1))

    // Ensure *unique* IDs
    let id = 1
    const nextId = () => id++

    const sample: Shift[] = [
      {
        id: nextId(),
        date: iso(rand(2, 25)),
        start: '10:00', end: '15:00',
        site: 'Site 1', position: 'Bartender', workerName: 'Maddie Byrd',
        wage: 25, earnings: 106.25,
        avatar: 'https://app.codigma.io/api/uploads/assets/498cb9f8-ce1f-4e2e-a0c9-d2aeec4b4383.svg',
        origin: 'source',
      },
      {
        id: nextId(),
        date: iso(rand(3, 26)),
        start: '09:00', end: '17:00',
        site: 'Site 2', position: 'Server', workerName: 'Jay Dunn',
        wage: 22, earnings: 176,
        avatar: 'https://placehold.co/48',
        origin: 'schedule',
      },
      {
        id: nextId(),
        date: iso(2), // likely “earlier in month”
        start: '08:00', end: '12:00',
        site: 'Site 3', position: 'Host', workerName: 'Alex Kim',
        wage: 20, earnings: 80,
        avatar: 'https://placehold.co/48',
        origin: 'schedule',
      },
    ]

    // Guarantee at least one near “today” for each origin to avoid empty screens.
    // Ensure the generated day is not before today (important near month end).
    const todayDay = today.getDate()
    let near1 = Math.min(todayDay + 1, 28)
    if (near1 < todayDay) near1 = todayDay
    let near2 = Math.min(todayDay + 2, 29)
    if (near2 < todayDay) near2 = todayDay

    sample.push({
      id: nextId(),
      date: iso(near1),
      start: '12:00', end: '16:00',
      site: 'Site 4', position: 'Runner', workerName: 'Chris Lee',
      wage: 21, earnings: 84,
      avatar: 'https://placehold.co/48',
      origin: 'source',
    })
    sample.push({
      id: nextId(),
      date: iso(near2),
      start: '14:00', end: '20:00',
      site: 'Site 5', position: 'Line Cook', workerName: 'Pat Diaz',
      wage: 24, earnings: 144,
      avatar: 'https://placehold.co/48',
      origin: 'schedule',
    })

    // Correct the `past` flag using **midnight** comparison (so “today” is NOT past)
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    for (const s of sample) {
      const d = new Date(s.date)
      s.past = !isNaN(d.getTime()) ? d < todayMidnight : false
    }

    // Optional: filter by args.month or start/end
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

    // debug: log what sample was generated and what's returned after filtering
    try {
      // avoid leaking large objects in prod; this is temporary debug info
      // eslint-disable-next-line no-console
      console.log('[useShiftsStore] fetchShifts args=', args, 'sample=', sample, 'filtered=', filtered)
    } catch (e) {
      /* ignore */
    }

    shifts.value = filtered
  }

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
