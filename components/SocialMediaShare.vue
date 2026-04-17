<script setup lang="ts">
const extensionUrl =
  "https://chrome.google.com/webstore/detail/stay-focused/nnlgodiccogbpcfnhmclaicljjgfmekd";
const shareText = "Stay Focused - Block distracting websites";

const shareLinks = [
  {
    platform: "Facebook",
    url: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(extensionUrl)}`,
    color: "#1877F2",
  },
  {
    platform: "Twitter",
    url: `https://twitter.com/share?url=${encodeURIComponent(extensionUrl)}&text=${encodeURIComponent(shareText)}`,
    color: "#000000",
  },
  {
    platform: "LinkedIn",
    url: `https://linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(extensionUrl)}&title=${encodeURIComponent(shareText)}`,
    color: "#0A66C2",
  },
];
</script>

<template>
  <div class="share-container">
    <p class="share-text">Enjoy using Stay Focused? Share it with your friends!</p>
    <div class="share-buttons">
      <a
        v-for="link in shareLinks"
        :key="link.platform"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="share-button"
        :style="{ backgroundColor: link.color }"
      >
        {{ link.platform }}
      </a>
    </div>
  </div>
</template>

<style scoped>
.share-container {
  text-align: center;
}

.share-text {
  font-size: 14px;
  color: #555;
  margin: 0 0 12px 0;
}

.share-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.share-button {
  display: inline-block;
  padding: 8px 20px;
  color: #ffffff;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
  transition:
    opacity 0.2s,
    box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.share-button:hover {
  opacity: 0.9;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
}
</style>
