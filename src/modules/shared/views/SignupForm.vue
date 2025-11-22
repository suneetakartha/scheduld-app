<template>
  <section class="min-h-screen grid place-items-center bg-black px-4">
    <!-- Blue panel -->
    <div class="w-[361px] bg-[#4466A8] overflow-hidden px-6 py-12">
      <!-- Title -->
      <h1 class="h-28 grid place-items-center text-white text-3xl font-bold">
        Great!
      </h1>

      <!-- Card -->
      <form
        class="w-[317px] mx-auto rounded-2xl bg-white px-5 py-6 grid gap-6"
        @submit.prevent="onSubmit"
        novalidate
      >
        <header class="text-center grid gap-1">
          <h2 class="text-2xl font-semibold text-neutral-800 leading-7">
            {{ title }}
          </h2>
          <p class="text-xs text-zinc-500">
            Selected role: <span class="font-semibold">{{ role }}</span>
          </p>
        </header>

        <!-- Inputs -->
        <div class="grid gap-6">
          <!-- Email -->
          <label class="h-12 py-3 border-b border-gray-200 flex items-center">
            <span class="sr-only">Email</span>
            <input
              v-model.trim="email"
              type="email"
              placeholder="Email"
              required
              class="w-full bg-transparent outline-none text-zinc-800 placeholder-zinc-500 text-sm"
            />
          </label>
          <p v-if="touched && !emailOk" class="text-xs text-red-600">Enter a valid email.</p>

          <!-- Password -->
          <label class="h-12 py-3 border-b border-gray-200 flex items-center gap-2">
            <span class="sr-only">Create Password</span>
            <input
              v-model="password"
              :type="showPw ? 'text' : 'password'"
              placeholder="Create Password"
              required
              class="w-full bg-transparent outline-none text-zinc-800 placeholder-zinc-500 text-sm"
            />
            <button
              type="button"
              class="text-xs text-zinc-500 hover:text-zinc-700"
              @click="showPw = !showPw"
            >
              {{ showPw ? 'Hide' : 'Show' }}
            </button>
          </label>
          <p v-if="touched && !pwOk" class="text-xs text-red-600">Password must be at least 8 characters.</p>

          <!-- Confirm Password -->
          <label class="h-12 py-3 border-b border-gray-200 flex items-center gap-2">
            <span class="sr-only">Confirm Password</span>
            <input
              v-model="confirmPw"
              :type="showConfirm ? 'text' : 'password'"
              placeholder="Confirm Password"
              required
              class="w-full bg-transparent outline-none text-zinc-800 placeholder-zinc-500 text-sm"
            />
            <button
              type="button"
              class="text-xs text-zinc-500 hover:text-zinc-700"
              @click="showConfirm = !showConfirm"
            >
              {{ showConfirm ? 'Hide' : 'Show' }}
            </button>
          </label>
          <p v-if="touched && !pwMatch" class="text-xs text-red-600">Passwords do not match.</p>

          <!-- Terms -->
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="agreed" class="h-4 w-4 accent-black" />
            <span class="text-sm text-black">
              I agree to <a href="#" class="underline">Terms and Conditions</a>
            </span>
          </label>
        </div>

        <!-- Actions -->
        <div class="grid gap-3">
          <button
            type="submit"
            :disabled="!formOk"
            :class="[
              'w-full rounded-xl grid place-items-center py-4 font-semibold transition-colors',
              formOk ? 'bg-sky-300 hover:bg-sky-400 text-black' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            ]"
          >
            Register
          </button>

          <div class="flex items-center gap-2">
            <div class="flex-1 h-px bg-zinc-300"></div>
            <span class="text-zinc-500 text-sm">Or</span>
            <div class="flex-1 h-px bg-zinc-300"></div>
          </div>

          <button
            type="button"
            @click="continueWithGoogle"
            class="w-full rounded-xl outline-1 outline-gray-200 px-3 py-3.5 inline-flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <!-- Simple Google "G" -->
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.7 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3 14.6 2 12 2 6.9 2 2.8 6.1 2.8 11.2S6.9 20.4 12 20.4c7.2 0 8.9-5 8.3-8.1H12z"/>
            </svg>
            <span class="text-stone-900 text-sm font-semibold">Continue with Google</span>
          </button>
        </div>

        <!-- Footer -->
        <p class="text-center text-sm">
          <span class="text-zinc-500">Have an account? </span>
          <RouterLink :to="{ name: 'login' }" class="text-neutral-800 font-semibold underline">
            Login
          </RouterLink>
        </p>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'

type Role = 'business' | 'worker'

const route = useRoute()
const router = useRouter()

// read role from query (?role=business|worker)
const role = ref<Role | null>(null)
function setRoleFromQuery(v: unknown) {
  if (v === 'business' || v === 'worker') role.value = v
  else role.value = null
}
setRoleFromQuery(route.query.role)
watch(() => route.query.role, setRoleFromQuery)

// if no role provided, bounce back to chooser
if (!role.value) {
  router.replace({ name: 'signupRedirect' })
}

// dynamic title
const title = computed(() =>
  role.value === 'business'
    ? 'Create Your Business Account'
    : role.value === 'worker'
    ? 'Create Your Worker Account'
    : 'Create Your Account'
)

// form state
const email = ref('')
const password = ref('')
const confirmPw = ref('')
const agreed = ref(false)
const showPw = ref(false)
const showConfirm = ref(false)
const touched = ref(false)

const allFilled = computed(
  () => !!role.value && !!email.value && !!password.value && !!confirmPw.value && agreed.value
)

// validation
const emailOk = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value || ''))
const pwOk = computed(() => (password.value?.length || 0) >= 8)
const pwMatch = computed(() => password.value === confirmPw.value)
const formOk = computed(() => !!role.value && emailOk.value && pwOk.value && pwMatch.value && agreed.value)

async function onSubmit() {
  touched.value = true
  if (!formOk.value) return
  // TODO: replace with real signup API call
  // await api.signup({ email: email.value, password: password.value, role: role.value })
  router.push({ name: 'home' })
}

function continueWithGoogle() {
  // TODO: wire your OAuth flow, include role (e.g., as state or query)
  // window.location.href = `/api/auth/google?role=${role.value}`
  console.log('Google auth clicked with role:', role.value)
}
</script>
