<script setup lang="ts">
import { ref } from "vue";
import { NInput, NButton, useMessage } from "naive-ui";
import type { LockSettings } from "~/utils/types";

const props = defineProps<{ lockSettings: LockSettings }>();
const emit = defineEmits<{ unlock: [] }>();
const password = ref("");
const message = useMessage();

function handleUnlock() {
  if (props.lockSettings.password === "") {
    // No password set — let them through to settings
    emit("unlock");
    return;
  }
  if (password.value.toLowerCase() === props.lockSettings.password.toLowerCase()) {
    emit("unlock");
  } else {
    message.error("Wrong Password!");
  }
}
</script>

<template>
  <div class="password-unlock">
    <div v-if="lockSettings.password === ''">
      <p>You haven't set a password yet! Go to settings to set it.</p>
      <n-button type="primary" @click="$emit('unlock')">Go To Settings</n-button>
    </div>
    <div v-else class="input-group">
      <n-input
        v-model:value="password"
        type="password"
        placeholder="Enter Password"
        @keyup.enter="handleUnlock"
      />
      <n-button type="primary" @click="handleUnlock">Unlock</n-button>
    </div>
  </div>
</template>

<style scoped>
.password-unlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
}
.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}
</style>
