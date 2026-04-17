<script setup lang="ts">
defineProps<{
  compact?: boolean;
}>();
</script>

<template>
  <div :class="['bmc-container', { compact }]">
    <p v-if="!compact" class="bmc-text">
      Love staying focused? Buy me a coffee to support updates and keep you on track!
    </p>
    <a
      href="https://www.buymeacoffee.com/maherkhdeir"
      target="_blank"
      rel="noopener noreferrer"
      :class="['bmc-button', { 'bmc-compact': compact }]"
    >
      <span class="bmc-emoji">☕</span>
      <span class="bmc-label">{{ compact ? "Buy me a coffee" : "Keep Me Focused" }}</span>
    </a>
  </div>
</template>

<style scoped>
.bmc-container {
  text-align: center;
}

.bmc-container.compact {
  text-align: left;
}

.bmc-text {
  font-size: 14px;
  color: #555;
  margin: 0 0 12px 0;
}

.bmc-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  background-color: #ffdd00;
  color: #0d0c22;
  border-radius: 8px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  transition:
    background-color 0.2s,
    box-shadow 0.2s;
}

.bmc-button:hover {
  background-color: #e6c800;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
}

.bmc-compact {
  padding: 4px 12px;
  font-size: 13px;
  border-radius: 6px;
  box-shadow: none;
  background-color: #fff8dc;
  border: 1px solid #f0d000;
}

.bmc-compact:hover {
  background-color: #ffdd00;
}

.bmc-emoji {
  font-size: 16px;
}
</style>
