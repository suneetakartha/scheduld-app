<template>
  <article
    class="w-80 p-3.5 bg-white rounded-lg shadow-[0px_5.538px_7.385px_0px_rgba(0,0,0,0.15)] inline-flex flex-col gap-3"
    role="group"
    aria-label="Shift card"
  >
    <!-- top row -->
    <header class="w-full inline-flex justify-between items-center">
      <span class="uppercase text-neutral-400 text-[9.23px] font-medium tracking-wide">
        {{ site }}
      </span>
      <button type="button" @click="$emit('menu')" class="w-6 h-6 grid place-items-center rounded hover:bg-black/5">
        <i class="pi pi-ellipsis-h text-black/60 text-[14px]" aria-hidden="true"></i>
      </button>
    </header>

    <!-- middle -->
    <section class="w-full px-3.5 inline-flex justify-between items-start">
      <div class="flex-1 flex items-start gap-3">
        <img
          :src="avatarUrl"
          alt="Shift avatar"
          class="w-9 h-9 rounded-full shadow-[0px_4px_4px_rgba(0,0,0,0.25)] object-cover"
        />
        <div class="flex-1 inline-flex flex-col gap-[2.77px]">
          <div class="inline-flex items-center gap-1.5">
            <h3 class="text-sm font-medium leading-tight" :style="{ color: brandHex }">
              {{ shiftTitle }}
            </h3>
          </div>

          <div class="inline-flex items-start gap-2">
            <div class="flex items-center gap-2">
              <i class="pi pi-calendar text-black/50 text-[12px]" aria-hidden="true"></i>
              <span class="text-neutral-400 text-xs font-medium">{{ dateLabel }}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-clock text-black/50 text-[12px]" aria-hidden="true"></i>
              <span class="text-neutral-400 text-xs font-medium">{{ timeLabel }}</span>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true"></div>
    </section>

    <!-- bottom -->
    <footer class="w-full px-3.5 flex flex-col gap-2">
      <div class="inline-flex items-center gap-2">
        <i class="pi pi-check-circle text-green-700 text-[12px]" aria-hidden="true"></i>
        <span class="text-neutral-400 text-xs font-medium">{{ staffedLabel }}</span>
      </div>
      <button
        type="button"
        @click="$emit('checklist')"
        class="inline-flex items-center gap-2 group"
        aria-label="Open setup checklist"
      >
        <i class="pi pi-list-check text-green-700 text-[12px]" aria-hidden="true"></i>
        <span class="text-neutral-400 text-xs font-medium group-hover:text-neutral-600">
          {{ checklistLabel }}
        </span>
      </button>
    </footer>
  </article>
</template>

<script setup lang="ts">
import 'primeicons/primeicons.css'

const props = withDefaults(defineProps<{
  site?: string
  shiftTitle?: string
  avatarUrl?: string
  dateLabel?: string
  timeLabel?: string
  staffedLabel?: string
  checklistLabel?: string
  brandHex?: string
}>(), {
  site: 'Site 2',
  shiftTitle: 'Shift 1',
  avatarUrl: 'https://placehold.co/37x37',
  dateLabel: 'Tomorrow',
  timeLabel: '10:00 am – 3:00 pm',
  staffedLabel: 'Fully Staffed',
  checklistLabel: 'Set up Prep Checklist',
  brandHex: '#4466A8',
})

defineEmits<{ (e: 'menu'): void; (e: 'checklist'): void }>()
</script>