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
  <div v-if="lockSettings" class="unlock-page">
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
</template>

<style scoped>
.unlock-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}
</style>
