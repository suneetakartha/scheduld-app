<!-- src/pages/BWA2SplashRedirectAnimation.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

type Choice = 'login' | 'signup' | null
const active = ref<Choice>(null)         // which button is “filled” right now
const router = useRouter()

const onLogin = () => {
  active.value = 'login'
  setTimeout(() => router.push('/login'), 120)
}

const onSignup = () => {
  active.value = 'signup'
  setTimeout(() => router.push('/signup-redirect'), 120)
}

// Tailwind class helpers (keeps template tidy)
const baseBtn =
  'flex-1 py-[7px] rounded-[11px] flex justify-center items-center text-center text-[13px] leading-none transition-colors duration-150 border focus:outline-none focus:ring-2 focus:ring-white/60'

const outline =
  'bg-transparent text-white border-white hover:bg-white/10 active:bg-white/20'

const filled =
  'bg-white text-black border-white hover:brightness-95 active:brightness-90'
</script>

<template>
  <section class="grid place-items-center h-screen w-screen bg-black text-white font-inter" role="main" aria-label="Welcome">
    <div class="relative w-[360px] h-[780px] bg-black overflow-hidden">
      <!-- Background image (put file in /public) -->
      <img src="/login_background.png" alt="" aria-hidden="true"
           class="absolute left-0 -top-[171.3px] w-[364.6px] h-[1094.1px] object-cover" />

      <!-- Top gradient -->
      <div class="absolute left-0 top-0 w-[360px] h-[211px] pointer-events-none"
           style="background: linear-gradient(180deg, rgba(0,0,0,.75) 0%, rgba(0,0,0,0) 80%);"
           aria-hidden="true"></div>

      <!-- CTA block -->
      <div class="absolute -left-[10px] top-[562px] inline-flex h-[231px] w-[380px] flex-col gap-[10px] px-[25px] py-[92px]">
        <!-- Bottom gradient -->
        <div class="absolute left-[370px] top-[221.38px] w-[360px] h-[211px] origin-top-left pointer-events-none"
             style="transform: rotate(-180deg); background: linear-gradient(0deg, rgba(0,0,0,0) 0%, #000 70%);"
             aria-hidden="true"></div>

        <!-- Buttons row -->
        <div class="z-10 inline-flex h-[31px] w-[330px] gap-[14px] px-[30px]">
          <button
            type="button"
            :class="[baseBtn, active === 'login' ? filled : outline]"
            :aria-pressed="active === 'login'"
            @click="onLogin"
          >
            Log In
          </button>

          <button
            type="button"
            :class="[baseBtn, active === 'signup' ? filled : outline]"
            :aria-pressed="active === 'signup'"
            @click="onSignup"
          >
            Sign Up
          </button>
        </div>
      </div>

      <!-- Wordmark (put file in /public/login/word-logo.png) -->
      <img src="/login/word-logo.png" alt="SwipeShift"
           class="absolute left-[16.11%] right-[14.83%] top-[73.37%] w-[69.06%] h-[6.23%] max-w-full max-h-full object-contain z-20" />
    </div>
  </section>
</template>
