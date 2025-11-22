<script setup lang="ts">
const props = withDefaults(defineProps<{
  direction?: "top" | "bottom";
  height?: string;
}>(), { direction: "top", height: "212px" });
</script>

<template>
  <div
    :class="[
      'pointer-events-none absolute inset-x-0',
      direction === 'top' ? 'top-0 bg-gradient-to-t' : 'bottom-0 bg-gradient-to-b',
      'from-transparent to-black'
    ]"
    :style="{ height }"
    aria-hidden="true"
  />
</template>
