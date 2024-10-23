<template>
  <div>
    <p>
      <b
        >Love staying focused? Buy me a coffee to support updates and keep you
        on track!</b
      >
    </p>
    <div :class="['buy-coffee-btn', { 'left-align': align === 'left' }]">
      <a
        :href="bmcUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="bmc-button"
      >
        <span v-if="showEmoji">{{ emoji }}</span>
        {{ buttonText }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "BuyMeACoffee",
  data() {
    return {
      bmcUrl: "https://www.buymeacoffee.com/maherkhdeir",
      buttonText: "Keep Me Focused",
      emoji: "☕"
    };
  },
  props: {
    showEmoji: { type: Boolean, default: true },
    align: { type: String, default: "center" } // New prop to set alignment
  }
};
</script>

<style scoped>
.buy-coffee-btn {
  margin-top: 10px;
  text-align: center; /* Default alignment */
}

.buy-coffee-btn.left-align {
  text-align: left; /* Left alignment when 'left-align' class is applied */
}

.bmc-button {
  display: inline-block;
  padding: 8px 20px;
  font-size: 16px;
  font-family: "Poppins", sans-serif;
  color: #000000;
  background-color: #ffd700;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, transform 0.2s, text-decoration 0.2s;
  cursor: pointer;
}

.bmc-button:hover {
  background-color: #ffcc00;
  transform: translateY(-1px);
  text-decoration: none;
}

.bmc-button:active {
  background-color: #e6b800;
  transform: translateY(1px);
  text-decoration: none;
}
</style>
