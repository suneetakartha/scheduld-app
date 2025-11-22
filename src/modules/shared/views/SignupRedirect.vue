<template>
  <section
    class="min-h-screen grid place-items-center bg-black text-white font-inter px-6"
    role="main"
    aria-label="Choose signup type"
  >
    <div class="w-full max-w-md grid gap-6">
      <header class="text-center grid gap-2">
        <h1 class="text-2xl font-bold">Create your account</h1>
        <p class="text-white/70 text-sm">Choose the option that fits you best</p>
      </header>

      <div class="grid gap-3">
        <!-- I'm a Business -->
        <button
          type="button"
          :class="[baseBtn, active === 'business' ? filled : outline]"
          :aria-pressed="active === 'business'"
          @click="choose('business')"
        >
          I’m a Business
        </button>

        <!-- I'm a Worker -->
        <button
          type="button"
          :class="[baseBtn, active === 'worker' ? filled : outline]"
          :aria-pressed="active === 'worker'"
          @click="choose('worker')"
        >
          I’m a Worker
        </button>
      </div>

      <!-- (Optional) small hint -->
      <p class="text-center text-xs text-white/60">
        You can change this later in Settings.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

type Role = 'business' | 'worker'
const active = ref<Role | null>(null)
const router = useRouter()

// Tailwind utility bundles for tidy templates
const baseBtn =
  'w-full rounded-xl px-4 py-4 text-center text-sm font-semibold transition-colors duration-150 border focus:outline-none focus:ring-2 focus:ring-white/60'
const outline =
  'bg-transparent text-white border-white hover:bg-white/10 active:bg-white/20'
const filled =
  'bg-white text-black border-white hover:brightness-95 active:brightness-90'

function choose(role: Role) {
  active.value = role
  // brief fill animation, then navigate
  setTimeout(() => {
    // Route strategy 1: named route with query (?role=business|worker)
    router.push({ name: 'signupForm', query: { role } })

    // Route strategy 2 (alternative): distinct paths
    // router.push({ path: `/signup/${role}` })
  }, 140)
}
</script>
