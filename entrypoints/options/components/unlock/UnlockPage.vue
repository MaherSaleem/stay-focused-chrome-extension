<script setup lang="ts">
import { ref, onMounted } from "vue";
import { chromeStorage } from "~/utils/storage";
import type { Settings, LockSettings } from "~/utils/types";
import PasswordUnlock from "./PasswordUnlock.vue";
import QuestionUnlock from "./QuestionUnlock.vue";
import ClickButtonUnlock from "./ClickButtonUnlock.vue";

const emit = defineEmits<{ unlock: [] }>();
const lockSettings = ref<LockSettings | null>(null);

onMounted(async () => {
  try {
    const settings = await chromeStorage.get<Settings>("settings");
    lockSettings.value = settings.lock;
  } catch {
    /* first-run: no settings yet */
  }
});

async function handleUnlock() {
  await chromeStorage.set("active", false);
  emit("unlock");
}
</script>

<template>
  <div class="unlock-page">
    <div class="unlock-card">
      <img src="/images/logo-red.png" alt="Stay Focused" class="logo" />
      <h2>Extension is locked</h2>
      <p class="subtitle">Complete the challenge below to access settings</p>

      <div v-if="lockSettings" class="unlock-content">
        <PasswordUnlock
          v-if="lockSettings.type === 'password'"
          :lock-settings="lockSettings"
          @unlock="handleUnlock"
        />
        <QuestionUnlock
          v-else-if="lockSettings.type === 'question'"
          :lock-settings="lockSettings"
          @unlock="handleUnlock"
        />
        <ClickButtonUnlock
          v-else-if="lockSettings.type === 'click-button'"
          :lock-settings="lockSettings"
          @unlock="handleUnlock"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.unlock-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.unlock-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 40px;
  text-align: center;
  max-width: 480px;
  width: 90%;
}

.logo {
  width: 140px;
  margin-bottom: 16px;
}

h2 {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin: 0 0 6px 0;
}

.subtitle {
  font-size: 14px;
  color: #888;
  margin: 0 0 24px 0;
}

.unlock-content {
  width: 100%;
}
</style>
