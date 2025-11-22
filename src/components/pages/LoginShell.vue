
<script setup lang="ts">
defineProps<{
  background?: string
}>();
</script>

<template>
  <section
    class="relative isolate min-h-screen w-full text-white bg-cover bg-center"
    :style="background ? { backgroundImage: `url(${background})` } : {}"
    role="main"
  >
    <!-- Dark overlay + gradient accents -->
    <div class="pointer-events-none absolute inset-0 -z-10 bg-black/50" />
    <div class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/60 to-transparent" />
    <div class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-black/60 to-transparent" />

    <!-- Centered content area -->
    <div class="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6">
      <slot />
    </div>
  </section>
</template>
