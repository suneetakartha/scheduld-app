<script setup lang="ts">
import { ref } from 'vue'

type Tab = 'source' | 'schedule'

interface Worker {
  id: number
  name: string
  avatar: string
  rating: number
  ratingCount: number
  position: string
  site: string
  hours: string
  earnings: number
  wage: number
}

const tab = ref<Tab>('source')

const nowWorking = ref<Worker[]>([
  {
    id: 1,
    name: 'Maddie Byrd',
    avatar: 'https://app.codigma.io/api/uploads/assets/498cb9f8-ce1f-4e2e-a0c9-d2aeec4b4383.svg',
    rating: 4.3,
    ratingCount: 13,
    position: 'Bartender',
    site: 'Site 1',
    hours: '4.25 hours (5:55 pm - Now)',
    earnings: 106.25,
    wage: 25,
  },
])

function setTab(next: Tab) {
  tab.value = next
  // later: fetch shifts based on tab
}
</script>

<template>
  <!-- This lives inside MobileStage's scroll area -->
  <div class="h-full overflow-y-auto bg-[#F6F6F6]">
    <!-- Timeline Tabs Header -->
    <section class="bg-[#EFF2F1] pb-4">
      <div
        class="flex w-full justify-between items-center bg-[#EFF2F1] h-12 rounded-b-xl shadow-sm relative z-10"
      >
        <!-- SwipeSource tab -->
        <button
          type="button"
          :class="[
            'flex-1 flex items-center justify-center h-12 cursor-pointer transition-colors border-b-4',
            tab === 'source'
              ? 'border-[#4466A8] bg-[#EFF2F1]'
              : 'border-[#EFF2F1]'
          ]"
          @click="setTab('source')"
        >
          <span
            :class="[
              'text-sm',
              tab === 'source' ? 'text-[#4466A8] font-medium' : 'text-[#8B8D98] font-normal'
            ]"
          >
            SwipeSource
          </span>
        </button>

        <div class="w-px h-6 bg-[#8B8D98]/25" />

        <!-- SwipeSchedule tab -->
        <button
          type="button"
          :class="[
            'flex-1 flex items-center justify-center h-12 cursor-pointer transition-colors border-b-4',
            tab === 'schedule'
              ? 'border-[#4466A8] bg-[#EFF2F1]'
              : 'border-[#EFF2F1]'
          ]"
          @click="setTab('schedule')"
        >
          <span
            :class="[
              'text-sm',
              tab === 'schedule' ? 'text-[#4466A8] font-medium' : 'text-[#8B8D98] font-normal'
            ]"
          >
            SwipeSchedule
          </span>
        </button>
      </div>
    </section>

    <!-- Main shifts section -->
    <section
      class="w-full flex flex-col gap-2.5 py-6 px-4 bg-[#4466A8] rounded-b-2xl min-h-[260px] relative"
    >
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-white font-medium text-[15px] tracking-wide">
          Now Working
        </h2>

        <button type="button" class="opacity-80">
          <span class="inline-block text-xs text-white/80">View all</span>
        </button>
      </div>

      <!-- Cards -->
      <TransitionGroup name="fade" tag="div">
        <article
          v-for="worker in nowWorking"
          :key="worker.id"
          class="bg-white rounded-xl shadow-md p-4 w-full max-w-[330px] flex flex-col gap-4 mx-auto"
        >
          <!-- Top row: site & menu -->
          <div class="flex justify-between items-center w-full mb-0.5">
            <div class="flex items-center gap-2">
              <div class="w-2.5 h-2.5 rounded-full bg-[#4CAF50] border-[2.7px] border-[#EFF2F1]" />
              <div class="text-xs text-[#8B8D98] font-medium ml-px">
                {{ worker.position.toUpperCase() }} - {{ worker.site }}
              </div>
            </div>

            <button type="button" class="opacity-85">
              <span class="text-gray-400 text-lg leading-none">⋮</span>
            </button>
          </div>

          <!-- Middle: avatar + info -->
          <div class="flex justify-between items-start w-full gap-2">
            <div class="flex gap-4 w-4/5">
              <div
                class="rounded-full overflow-hidden w-12 h-12 border border-[#EFF2F1] bg-[#F6F6F6] flex-shrink-0"
              >
                <img :src="worker.avatar" alt="" class="w-full h-full object-cover" />
              </div>

              <div class="flex flex-col gap-1.5">
                <!-- Name + rating -->
                <div class="flex items-center gap-2">
                  <div class="text-[#4466A8] text-base font-bold">
                    {{ worker.name }}
                  </div>
                  <div class="flex items-center gap-1 text-sm">
                    <span class="text-yellow-400 text-xs">★</span>
                    <span class="text-[#8B8D98] font-medium opacity-85 ml-px">
                      {{ worker.rating }} ({{ worker.ratingCount }})
                    </span>
                  </div>
                </div>

                <!-- Hours -->
                <div class="flex items-center text-sm text-[#8B8D98] gap-1.5">
                  <span class="w-4 h-4 rounded-full bg-black/10 inline-block" />
                  <span>{{ worker.hours }}</span>
                </div>

                <!-- Earnings -->
                <div class="flex items-center text-sm text-[#8B8D98] gap-1.5">
                  <span class="w-4 h-4 rounded-full bg-black/10 inline-block" />
                  <span>Current Earnings - ${{ worker.earnings.toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Wage pill -->
            <div
              class="bg-[#F6F6F6] px-3.5 py-1.5 text-[#26B46A] font-bold text-base mt-2 rounded-lg shadow-sm whitespace-nowrap ml-2 self-end"
            >
              ${{ worker.wage }}/hr
            </div>
          </div>

          <!-- Bottom row: actions -->
          <div class="flex w-full justify-between items-center mt-1 gap-2">
            <button
              type="button"
              class="flex-1 rounded-lg min-h-[37px] bg-[#EFF2F1] text-[#4466A8] text-base font-medium focus:outline-none"
            >
              View Profile
            </button>
            <button
              type="button"
              class="flex-1 rounded-lg min-h-[37px] bg-[#4466A8] text-white text-base font-medium ml-2 focus:outline-none"
            >
              Manage Shift
            </button>
          </div>
        </article>
      </TransitionGroup>
    </section>

    <!-- Spacer so content doesn’t hide behind NavBar -->
    <div class="h-6" />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
