<script setup lang="ts">
import { ref } from 'vue'
import MobileStage from '@/components/MobileStage.vue'
import NavBar from '@/components/NavBar.vue'
import NotificationCard from '@/components/NotificationCard.vue'
import ShiftCard from '@/components/ShiftCard.vue'

const tab = ref<'home'|'shifts'|'new'|'reports'|'notifications'>('home')
const show = ref(true)
function handleClose() { show.value = false }
function openMenu() {}
function openChecklist() {}
</script>

<template>
  <!-- If your MobileStage supports footerHeight, pass it (e.g., :footerHeight="64") -->
  <MobileStage>
    <!-- Make inner area scrollable & padded; add bottom padding so footer doesn’t cover it -->
    <div class="h-full overflow-y-auto p-4 pb-16">
      <!-- Toast inside the stage, narrower than the 360px stage -->
      <NotificationCard
        :show="show"
        anchor="absolute"
        :edgePadding="12"
        :maxWidth="340"
        :duration="0"
        type="warning"
        title="SwipeSchedules are ready for review"
        message="Workers submitted availability for the next 2 weeks. Your SwipeSchedule is ready for approval."
        timeAgo="10 minutes ago"
        status="Unread"
        @close="handleClose"
      />

      <h1 class="text-xl font-semibold mt-4">Home</h1>
      <p class="text-black/70">Welcome back!</p>

      <div class="mt-4">
        <ShiftCard
          site="Site 2"
          shiftTitle="Shift 1"
          dateLabel="Tomorrow"
          timeLabel="10:00 am – 3:00 pm"
          staffedLabel="Fully Staffed"
          checklistLabel="Set up Prep Checklist"
          @menu="openMenu"
          @checklist="openChecklist"
        />
      </div>

      <h1 class="text-xl font-semibold mt-8">SwipeSource Shifts</h1>
      <p class="text-black/70 mt-2">Upcoming SwipeSource Workers</p>

      <div class="mt-4">
        <ShiftCard
          site="Site 2"
          shiftTitle="Shift 1"
          dateLabel="Tomorrow"
          timeLabel="10:00 am – 3:00 pm"
          staffedLabel="Fully Staffed"
          checklistLabel="Set up Prep Checklist"
          @menu="openMenu"
          @checklist="openChecklist"
        />
      </div>
    </div>

    <!-- Footer stays inside the stage -->
    <template #footer>
      <NavBar
        v-model="tab"
        :routes="{
          home: { name: 'home' },
          shifts: '/shifts',
          new: '/new',
          reports: '/reports',
          notifications: '/notifications'
        }"
      />
    </template>
  </MobileStage>
</template>