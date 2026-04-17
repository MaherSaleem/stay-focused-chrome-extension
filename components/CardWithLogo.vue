<script setup lang="ts">
</script>

<template>
  <div class="card-with-logo">
    <img class="logo" src="~/assets/images/logo-red.png" alt="Stay Focused" />
    <div class="card-header">
      <slot name="header" />
    </div>
    <div class="card-media">
      <slot name="media" />
    </div>
  </div>
</template>

<style scoped>
.card-with-logo {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  text-align: center;
  max-width: 600px;
  width: 90%;
  margin: 0 auto;
}

.logo {
  width: 180px;
  margin-bottom: 16px;
}
</style>
