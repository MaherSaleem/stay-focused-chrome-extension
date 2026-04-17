<script setup lang="ts">
import { NCard } from "naive-ui";
</script>

<template>
  <div class="about-tab">
    <NCard class="about-card" title="About The Extension">
      <p>
        Stay Focused is an open-source Chrome extension designed to block distracting websites, such
        as social media platforms.
      </p>
      <p>
        The concept is simple: you might start working, only to find yourself scrolling through
        social media like Facebook for 30 minutes without realizing it. This extension displays a
        reminder image to help you get back to work.
      </p>
    </NCard>

    <NCard class="about-card" title="Developed By">
      <p>Maher Khdeir</p>
      <a target="_blank" href="https://www.linkedin.com/in/maher-khdeir/">LinkedIn</a>
    </NCard>

    <NCard class="about-card">
      <BuyMeACoffee />
    </NCard>

    <NCard class="about-card">
      <SocialMediaShare />
    </NCard>

    <NCard class="about-card" title="Interested in contributing?">
      Visit our open-source GitHub repository.
      <a target="_blank" href="https://github.com/MaherSaleem/stay-focused-chrome-extension"
        >Github Repository</a
      >.
    </NCard>
  </div>
</template>

<style scoped>
.about-tab {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.about-card {
  margin-bottom: 1%;
}
</style>
