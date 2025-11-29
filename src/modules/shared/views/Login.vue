<!-- src/views/Login.vue -->
<template>
  <div class="w-96 h-[779px] relative mx-auto">
    <div class="w-96 h-[779px] absolute inset-0 inline-flex justify-start items-center gap-2.5">
      <div class="px-5 py-12 bg-[#4466A8] flex justify-start items-center gap-2.5 overflow-hidden w-full h-full">
        <div class="w-80 h-[685.38px] inline-flex flex-col justify-start items-start">

          <!-- OPTIONAL LOGO / HERO IMAGE -->
          <!-- If your image is in /public, use an absolute path like /brand/wordmark.png -->
          <!-- <img src="/brand/wordmark.png" alt="SwipeShift" class="h-10 mb-4 object-contain" /> -->

          <!-- If your image is in src/assets, import it below and bind like :src="logo" -->
          <!-- <img :src="logo" alt="SwipeShift" class="h-10 mb-4 object-contain" /> -->

          <h1 class="self-stretch h-28 grid place-items-center text-white text-3xl font-bold font-['Inter']">
            Welcome back!
          </h1>

          <form class="w-80 px-4 py-6 bg-white rounded-2xl flex flex-col gap-6" @submit.prevent="onSubmit">
            <div class="self-stretch flex flex-col gap-1">
              <h2 class="text-neutral-800 text-2xl font-semibold leading-7">Sign In</h2>
            </div>

            <div class="self-stretch flex flex-col justify-between gap-6">
              <!-- Inputs -->
              <div class="self-stretch flex flex-col gap-6">
                <label class="h-12 py-3 border-b border-gray-200 inline-flex items-center gap-2.5">
                  <span class="sr-only">Email</span>
                  <input
                    v-model.trim="email"
                    type="email"
                    required
                    placeholder="Email"
                    class="w-full bg-transparent outline-none text-zinc-800 placeholder-zinc-500 text-sm"
                  />
                </label>

                <label class="h-12 py-3 border-b border-gray-200 inline-flex items-center gap-2.5">
                  <span class="sr-only">Password</span>
                  <input
                    v-model="password"
                    :type="showPw ? 'text' : 'password'"
                    required
                    placeholder="Password"
                    class="w-full bg-transparent outline-none text-zinc-800 placeholder-zinc-500 text-sm"
                  />
                  <button
                    type="button"
                    class="text-xs text-zinc-500 hover:text-zinc-700"
                    @click="showPw = !showPw"
                    aria-label="Toggle password visibility"
                  >
                    {{ showPw ? 'Hide' : 'Show' }}
                  </button>
                </label>
              </div>

              <!-- Actions -->
              <div class="self-stretch flex flex-col gap-3">
                <button
                  type="submit"
                  class="w-full px-2 py-5 bg-slate-300 hover:bg-slate-400 rounded-xl grid place-items-center"
                >
                  <span class="text-zinc-800 text-sm font-semibold">Log in</span>
                </button>

                <div class="self-stretch inline-flex items-center gap-2">
                  <div class="flex-1 h-px bg-zinc-300"></div>
                  <span class="text-zinc-500 text-sm">Or</span>
                  <div class="flex-1 h-px bg-zinc-300"></div>
                </div>

                <button
                  type="button"
                  @click="continueWithGoogle"
                  class="w-full px-2 py-3.5 rounded-xl outline-1 outline-offset-[-1px] outline-gray-200 inline-flex justify-center items-center gap-2 hover:bg-gray-50"
                >
                  <!-- Simple “G” mark -->
                  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.7 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3 14.6 2 12 2 6.9 2 2.8 6.1 2.8 11.2S6.9 20.4 12 20.4c7.2 0 8.9-5 8.3-8.1H12z"/>
                  </svg>
                  <span class="text-stone-900 text-sm font-semibold">Continue with Google</span>
                </button>
              </div>
            </div>

            <p class="self-stretch text-center">
              <span class="text-zinc-500 text-sm">Don’t have an account? </span>
              <RouterLink :to="{ name: 'signupRedirect' }" class="text-neutral-800 text-sm font-semibold underline">
                Sign Up
              </RouterLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuth } from '@/modules/shared/stores/useAuth'

// If you keep a logo under src/assets, uncomment the next line and the <img :src="logo" .../> in template
// import logo from '@/assets/brand/wordmark.png'

const email = ref('')
const password = ref('')
const showPw = ref(false)
const errorMsg = ref<string | null>(null)

const auth = useAuth()
const router = useRouter()
const route = useRoute()

type Role = 'worker' | 'business'
const TEST_USERS: Record<string, { password: string; role: Role }> = {
  'worker@test.com': { password: 'Passw0rd!23', role: 'worker' },
  'owner@biz.com':   { password: 'Passw0rd!23', role: 'business' },
}

async function onSubmit() {
  errorMsg.value = null
  const key = email.value.trim().toLowerCase()
  const rec = TEST_USERS[key]

  if (!rec || rec.password !== password.value) {
    errorMsg.value = 'Invalid email or password for this test account.'
    return
  }

  // set role in Pinia
  auth.loginAs(rec.role)

  // honor ?redirect=
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
  if (redirect) {
    try { await router.replace(redirect); return } catch { /* fall through */ }
  }
  await router.replace(rec.role === 'worker' ? { name: 'w.home' } : { name: 'b.home' })
}

function continueWithGoogle() {
  console.log('Google auth clicked')
}
</script>
