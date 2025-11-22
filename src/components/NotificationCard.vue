<template>
  <transition name="notification-fade">
    <!-- OUTER: fills the stage horizontally -->
    <div
      v-if="show"
      :class="floating ? (anchor === 'absolute' ? 'absolute' : 'fixed') : 'relative'"
      class="block inset-x-0"
      :style="{
        top: floating ? `${topOffset}px` : undefined,
        zIndex: floating ? 1000 : undefined
      }"
      @mouseenter="pauseTimer"
      @mouseleave="resumeTimer"
    >
      <!-- INNER: centered, with guaranteed width -->
      <div
        class="mx-auto w-full px-2.5 pt-3 pb-2.5 relative bg-white rounded
              outline outline-[3px] outline-offset-[-3px]
              inline-flex flex-col gap-3"
        :style="{
          /* width = min(stage width - 2*edgePadding, maxWidth) */
          width: `min(calc(100% - ${edgePadding * 2}px), ${maxWidth}px)`,
          ...outlineStyle
        }"
        role="status"
        :aria-live="type === 'error' ? 'assertive' : 'polite'"
      >
        <!-- header row -->
        <div class="w-full inline-flex items-start gap-3.5">
          <div class="relative flex items-start">
            <div :class="['w-10 h-10 rounded-full', avatarColor]" />
            <div v-if="status === 'Unread'" class="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-pink-500" />
          </div>

          <div class="flex-1 inline-flex flex-col gap-1">
            <p class="text-neutral-800 text-sm font-semibold leading-snug">{{ title }}</p>
            <p v-if="message" class="text-zinc-500 text-xs font-medium leading-tight">{{ message }}</p>
            <p v-if="timeAgo" class="text-gray-400 text-[10px] leading-3">{{ timeAgo }}</p>
          </div>
        </div>

        <!-- decorative equalizer -->
        <div class="w-6 h-6 left-[16px] top-[22px] absolute bg-black overflow-hidden rounded-sm">
          <div class="w-4 h-1 left-[1px]  top-[4px]  absolute bg-emerald-200 shadow-[0_4px_4px_rgba(0,0,0,0.25)]"></div>
          <div class="w-4 h-1 left-[3px]  top-[10px] absolute bg-amber-300/30 shadow-[0_4px_4px_rgba(0,0,0,0.25)]"></div>
          <div class="w-4 h-1 left-[5px]  top-[16px] absolute bg-slate-400 shadow-[0_4px_4px_rgba(0,0,0,0.25)]"></div>
        </div>

        <button
          type="button"
          class="absolute right-2 top-2 text-zinc-500 hover:text-zinc-700"
          aria-label="Close notification"
          @click="closeNotification"
        >
          &times;
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

type Kind = 'info' | 'success' | 'warning' | 'error'
type Status = 'Unread' | 'Read'
type Anchor = 'fixed' | 'absolute'

const props = withDefaults(defineProps<{
  show?: boolean
  type?: Kind
  title: string
  message?: string
  timeAgo?: string
  duration?: number
  status?: Status
  floating?: boolean
  avatarColor?: string
  anchor?: Anchor            // 'absolute' = inside MobileStage; 'fixed' = viewport
  edgePadding?: number       // px inset from stage edges
  maxWidth?: number          // px cap for width
  topOffset?: number         // px from top when floating
}>(), {
  show: false,
  type: 'info',
  message: '',
  timeAgo: '',
  duration: 0,               // 0 = sticky (manual close)
  status: 'Unread',
  floating: false,
  avatarColor: 'bg-neutral-800',
  anchor: 'absolute',
  edgePadding: 12,
  maxWidth: 340,
  topOffset: 20,
})

const emit = defineEmits<{ (e: 'close'): void }>()

// outline color per type
const outlineStyle = computed(() => {
  const map: Record<Kind, string> = {
    info:    'rgba(125, 211, 252, 0.30)',  // sky-300/30
    success: 'rgba(167, 243, 208, 0.30)',  // emerald-200/30
    warning: 'rgba(251, 191, 36,  0.30)',  // amber-400/30
    error:   'rgba(253, 164, 175, 0.30)',  // rose-300/30
  }
  return { outlineColor: map[props.type] }
})

// auto-close timer (kept, but duration=0 by default so it won't run)
let timeoutId: ReturnType<typeof setTimeout> | null = null
const paused = ref(false)
const remaining = ref(props.duration)
let lastStart = 0

function startCloseTimer() {
  clearCloseTimer()
  if (!props.duration || props.duration <= 0) return
  lastStart = Date.now()
  timeoutId = setTimeout(closeNotification, remaining.value)
}
function clearCloseTimer() {
  if (timeoutId) { clearTimeout(timeoutId); timeoutId = null }
}
function pauseTimer() {
  if (!timeoutId) return
  paused.value = true
  remaining.value = Math.max(0, remaining.value - (Date.now() - lastStart))
  clearCloseTimer()
}
function resumeTimer() {
  if (!paused.value) return
  paused.value = false
  startCloseTimer()
}
function closeNotification() {
  clearCloseTimer()
  emit('close')
}

watch(() => props.show, (v) => {
  remaining.value = props.duration
  paused.value = false
  if (v) startCloseTimer()
  else clearCloseTimer()
}, { immediate: true })

onBeforeUnmount(clearCloseTimer)
</script>

<style scoped>
.notification-fade-enter-active,
.notification-fade-leave-active { transition: opacity .25s ease, transform .25s ease; }
.notification-fade-enter-from,
.notification-fade-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
