<script setup lang="ts">
defineOptions({ name: "ImButton" });

const props = withDefaults(defineProps<{
  variant?: "solid" | "outline";
  block?: boolean;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}>(), {
  variant: "solid",
  block: false,
  loading: false,
  disabled: false,
  type: "button",
});

const emit = defineEmits<{ (e: "click", evt: MouseEvent): void }>();
function onClick(evt: MouseEvent) {
  if (props.disabled || props.loading) return;
  emit("click", evt);
}
</script>

<template>
  <button
    :type="type"
    @click="onClick"
    :disabled="disabled || loading"
    :class="[
      // base
      'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm leading-none outline-none transition',
      block ? 'w-full' : '',
      // variants
      variant === 'solid'
        ? 'bg-white text-black hover:brightness-95 focus-visible:ring-2 focus-visible:ring-white/70'
        : 'border border-white/90 text-white hover:border-white focus-visible:ring-2 focus-visible:ring-white/70',
      // disabled
      (disabled || loading) ? 'opacity-60 pointer-events-none' : '',
      // allow parent to pass extra classes
      $attrs.class as string || ''
    ]"
  >
    <slot />
    <span v-if="loading" class="sr-only">Loading…</span>
  </button>
</template>
