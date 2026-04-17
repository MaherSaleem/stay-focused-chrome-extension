<script setup lang="ts">
import { ref, onMounted } from "vue";
import { chromeStorage } from "~/utils/storage";
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
    const settings = await chromeStorage.get<Settings>("settings");
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
  <div class="goback-page">
    <div class="goback-hero">
      <div class="hero-icon">🚫</div>
      <h1 class="hero-title">This site is blocked</h1>
      <p class="hero-subtitle">Stay Focused is keeping you productive</p>
    </div>

    <div class="goback-card">
      <img
        class="goback-image"
        :src="randomImage.path"
        alt="Go back to work"
      />
      <p v-if="randomImage.text" class="image-caption">{{ randomImage.text }}</p>
    </div>

    <div class="goback-footer">
      <p>Want to unblock? Open the extension settings.</p>
    </div>
  </div>
</template>

<style scoped>
.goback-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  font-family: system-ui, -apple-system, sans-serif;
}

.goback-hero {
  text-align: center;
  margin-bottom: 32px;
}

.hero-icon {
  font-size: 64px;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  font-weight: 400;
}

.goback-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 24px;
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.goback-image {
  width: 100%;
  border-radius: 12px;
  display: block;
}

.image-caption {
  margin: 16px 0 0 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.goback-footer {
  margin-top: 24px;
  text-align: center;
}

.goback-footer p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 0;
}
</style>
