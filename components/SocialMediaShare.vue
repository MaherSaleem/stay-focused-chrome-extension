<script setup lang="ts">
const extensionUrl =
  "https://chrome.google.com/webstore/detail/stay-focused/nnlgodiccogbpcfnhmclaicljjgfmekd";
const shareText = "Stay Focused - Block distracting websites";

const shareLinks = {
  twitter: `https://twitter.com/share?url=${encodeURIComponent(extensionUrl)}&text=${encodeURIComponent(shareText)}`,
  facebook: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(extensionUrl)}`,
  linkedin: `https://linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(extensionUrl)}&title=${encodeURIComponent(shareText)}`,
};
</script>

<template>
  <div class="share-buttons">
    <span>Share:</span>
    <a
      v-for="(url, platform) in shareLinks"
      :key="platform"
      :href="url"
      target="_blank"
      rel="noopener noreferrer"
      class="share-link"
    >
      {{ platform }}
    </a>
  </div>
</template>

<style scoped>
.share-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.share-link {
  text-transform: capitalize;
  color: #448aff;
  text-decoration: none;
}

.share-link:hover {
  text-decoration: underline;
}
</style>
