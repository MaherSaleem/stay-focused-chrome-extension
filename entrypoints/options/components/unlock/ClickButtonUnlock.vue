<script setup lang="ts">
import { ref, onMounted } from "vue";
import { NButton } from "naive-ui";
import type { LockSettings } from "~/utils/types";

const props = defineProps<{ lockSettings: LockSettings }>();
const emit = defineEmits<{ unlock: [] }>();

const clicksLeft = ref(props.lockSettings.clickButtonCounts);
const buttonTop = ref("50%");
const buttonLeft = ref("50%");

function moveButton() {
  buttonTop.value = Math.floor(Math.random() * 80 + 5) + "%";
  buttonLeft.value = Math.floor(Math.random() * 70 + 5) + "%";
}

function handleClick() {
  clicksLeft.value--;
  if (clicksLeft.value <= 0) {
    emit("unlock");
  } else {
    moveButton();
  }
}

onMounted(() => {
  moveButton();
});
</script>

<template>
  <div class="click-unlock">
    <h3>Click the moving button to unlock</h3>
    <div class="button-area">
      <n-button
        type="primary"
        class="moving-btn"
        :style="{ top: buttonTop, left: buttonLeft }"
        @click="handleClick"
        @keydown.enter.prevent
        @keydown.space.prevent
      >
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
  width: 100%;
}

h3 {
  font-weight: 500;
  color: #333;
}

.button-area {
  position: relative;
  width: 100%;
  height: 350px;
  border: 2px dashed #ddd;
  border-radius: 12px;
  background: #fafafa;
}

.moving-btn {
  position: absolute;
  transition:
    top 0.15s,
    left 0.15s;
}
</style>
