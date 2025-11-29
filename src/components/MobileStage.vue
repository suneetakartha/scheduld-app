<template>
  <!-- centered horizontally; transparent page background -->
  <section class="flex justify-center bg-transparent text-black/70">
    <div
      class="relative overflow-hidden bg-[#EFF2F1]"
      :style="{
        width: w + 'px',
        height: h + 'px',
        '--footer-h': footerHeight + 'px',
        '--header-h': headerHeight + 'px'
      }"
    >
      <!-- scrollable content; padded for header + footer safe areas -->
      <div
        class="absolute inset-0 overflow-y-auto"
        :style="{
          paddingTop:  `calc(var(--header-h) + env(safe-area-inset-top))`,
          paddingBottom: `calc(var(--footer-h) + env(safe-area-inset-bottom))`
        }"
      >
        <slot />
      </div>

      <!-- fixed header inside the stage -->
      <div
        class="absolute inset-x-0 top-0"
        :style="{
          height: `calc(var(--header-h) + env(safe-area-inset-top))`,
          paddingTop: 'env(safe-area-inset-top)'
        }"
      >
        <slot name="header" />
      </div>

      <!-- fixed footer inside the stage -->
      <div
        class="absolute inset-x-0 bottom-0"
        :style="{
          height: `calc(var(--footer-h) + env(safe-area-inset-bottom))`,
          paddingBottom: 'env(safe-area-inset-bottom)'
        }"
      >
        <slot name="footer" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  w?: number
  h?: number
  headerHeight?: number
  footerHeight?: number
}>(), {
  w: 360,
  h: 780,
  headerHeight: 64, // ← new
  footerHeight: 64,
})
</script>
