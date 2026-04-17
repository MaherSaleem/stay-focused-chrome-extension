<script setup lang="ts">
import { ref } from "vue";
import { NButton } from "naive-ui";
import type { LockSettings } from "~/utils/types";

const props = defineProps<{ lockSettings: LockSettings }>();
const emit = defineEmits<{ unlock: [] }>();

const clicksLeft = ref(props.lockSettings.clickButtonCounts);
const buttonAlign = ref("center");

function updateButtonPosition() {
  const positions = ["center", "left", "right"];
  buttonAlign.value = positions[Math.floor(Math.random() * positions.length)];
}

function handleClick() {
  clicksLeft.value--;
  updateButtonPosition();
  if (clicksLeft.value <= 0) {
    emit("unlock");
  }
}
</script>

<template>
  <div class="click-unlock">
    <div class="button-area" :style="{ textAlign: buttonAlign }">
      <n-button type="primary" @click="handleClick" @keydown.enter.prevent @keydown.space.prevent>
        {{ clicksLeft }} clicks to unlock
      </n-button>
    </div>
  </div>
</template>

<style scoped>
.click-unlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
}
.button-area {
  width: 100%;
}
</style>
