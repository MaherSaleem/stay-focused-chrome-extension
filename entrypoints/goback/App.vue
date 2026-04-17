<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storage } from "~/utils/storage";
import type { Settings } from "~/utils/types";

interface GoBackImage {
  path: string;
  text: string;
}

const imagesObjects: GoBackImage[] = [
  { path: "/goback/images/access-blocked-websites.jpg", text: "" },
  { path: "/goback/images/angry-monkey.jpg", text: "Go Back to work now!" },
  {
    path: "/goback/images/Black-Girl-Wat.jpg",
    text: "WAT are you doing here? Go to work",
  },
  {
    path: "/goback/images/troll.jpg",
    text: "you didn't learn your lesson right? Go to work",
  },
  { path: "/goback/images/angry-white-monkey.jpg", text: "Goooooo!" },
  {
    path: "/goback/images/coffin-dance.jpg",
    text: "Go to work or dance with us!",
  },
  { path: "/goback/images/spongebob.jpg", text: "" },
  { path: "/goback/images/baby.jpg", text: "" },
  { path: "/goback/images/can-you-please-just-go-away.png", text: "" },
  {
    path: "/goback/images/we-dont-do-that-here.png",
    text: "When you open a blocked website instead of working.",
  },
  {
    path: "/goback/images/Surprised-Joey.jpg",
    text: "When I see you trying to open a blocked website",
  },
  {
    path: "/goback/images/ross.jpg",
    text: "When I see you trying again and again to open a blocked website",
  },
  {
    path: "/goback/images/chandler-oh-my-god.jpg",
    text: "when you don't learn the lesson and break your work again",
  },
  {
    path: "/goback/images/chandler-laugh.jpg",
    text: "My face when I block a website for you",
  },
];

const randomImage = ref<GoBackImage>(imagesObjects[0]);

onMounted(async () => {
  try {
    const settings = await storage.get<Settings>("settings");
    if (settings.allowFunnyGoBackImages) {
      const index = Math.floor(Math.random() * imagesObjects.length);
      randomImage.value = imagesObjects[index];
    }
  } catch {
    // Use default image
  }
});
</script>

<template>
  <div class="goback-container">
    <div class="goback-card">
      <img class="logo" src="~/assets/images/logo-red.png" alt="Stay Focused" />
      <h2 v-if="randomImage.text">{{ randomImage.text }}</h2>
      <img class="goback-image" :src="randomImage.path" alt="Go back to work" />
    </div>
  </div>
</template>

<style scoped>
.goback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: system-ui, sans-serif;
}

.goback-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  text-align: center;
  max-width: 600px;
  width: 90%;
}

.logo {
  width: 180px;
  margin-bottom: 16px;
}

.goback-image {
  width: 95%;
  border-radius: 4px;
  margin-top: 16px;
}

h2 {
  color: #333;
  font-weight: 500;
  margin: 8px 0;
}
</style>
