<template>
  <header
    class="w-full bg-[#4466A8] text-white flex items-center justify-between px-7 pt-8 pb-2"
    :style="{ height: headerHeight + 'px' }"
  >
    <!-- Left: avatar -->
    <button type="button" class="w-10 h-10 rounded-full overflow-hidden shrink-0" @click="$emit('avatar')">
      <img :src="avatarSrc" alt="Avatar" class="w-full h-full object-cover" />
    </button>

    <!-- Right: logo box (white rectangle as in the mock) -->
    <button
      type="button"
      class="relative w-11 h-11 shrink-0 grid place-items-center"
      @click="$emit('logo')"
    >
      <div class="absolute" :style="{ width: '38.5px', height: '31.17px', background: '#fff' }" />
      <!-- If you want a real logo instead, uncomment:
      <img :src="logoSrc" alt="Logo" class="w-14 h-5 object-contain" />
      -->
    </button>
  </header>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  avatarSrc?: string
  // logoSrc?: string   // use this if you want to swap the white rectangle with an actual logo
  headerHeight?: number
}>(), {
  avatarSrc: 'https://placehold.co/40x40',
  // logoSrc: '/brand/wordmark.svg',
  headerHeight: 64, // ~pt-8 + pb-2 visual
})

defineEmits<{
  (e: 'avatar'): void
  (e: 'logo'): void
}>()
</script>
