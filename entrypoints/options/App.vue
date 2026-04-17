<template>
  <n-message-provider>
    <n-dialog-provider>
      <div class="page-container">
      <n-spin v-if="loading" :size="80" class="loader" />

      <UnlockPage v-else-if="isLocked" @unlock="handleUnlock" />

      <n-layout v-else has-sider class="main-layout">
        <n-layout-sider bordered :width="240" content-style="display: flex; flex-direction: column; background-color: #fafafa;">
          <div class="sider-logo">
            <img src="/images/logo-red.png" alt="Stay Focused" class="logo-img" />
          </div>
          <n-menu :value="selectedTab" :options="menuOptions" @update:value="selectTab" />
        </n-layout-sider>

        <n-layout>
          <div class="header-bar">
            <span class="header-title">Stay Focused</span>
            <div class="header-actions">
              <span class="active-label">{{ active ? "Active" : "Inactive" }}</span>
              <n-switch v-model:value="active" />
            </div>
          </div>

          <div class="content-area">
            <component :is="currentTabComponent" @reload-data="loadData" />
          </div>
        </n-layout>
      </n-layout>
      </div>
    </n-dialog-provider>
  </n-message-provider>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, type Component } from "vue";
import { chromeStorage } from "~/utils/storage";
import type { Settings } from "~/utils/types";

import BlockByWebsiteTab from "./components/BlockByWebsiteTab.vue";
import BlockByWordTab from "./components/BlockByWordTab.vue";
import BlockByRegexTab from "./components/BlockByRegexTab.vue";
import SettingsTab from "./components/SettingsTab.vue";
import AboutTab from "./components/AboutTab.vue";
import UnlockPage from "./components/unlock/UnlockPage.vue";

const loading = ref(true);
const active = ref(false);
const isLocked = ref(false);
const selectedTab = ref("block-by-website");

const menuOptions = [
  { label: "🌐  Block By Website", key: "block-by-website" },
  { label: "📝  Block Using a Word", key: "block-by-word" },
  { label: "🔍  Block Using Regex", key: "block-by-regex" },
  { label: "⚙️  Settings", key: "settings" },
  { label: "ℹ️  About", key: "about" },
];

const tabComponents: Record<string, Component> = {
  "block-by-website": BlockByWebsiteTab,
  "block-by-word": BlockByWordTab,
  "block-by-regex": BlockByRegexTab,
  settings: SettingsTab,
  about: AboutTab,
};

const currentTabComponent = computed(() => tabComponents[selectedTab.value]);

function selectTab(key: string) {
  selectedTab.value = key;
}

function handleUnlock() {
  isLocked.value = false;
  active.value = false;
}

async function loadData() {
  try {
    active.value = await chromeStorage.get<boolean>("active");
  } catch {
    // key missing — first run, default false
  }

  try {
    const settings = await chromeStorage.get<Settings>("settings");
    const lockType = settings.lock.type;
    isLocked.value = lockType !== "none" && (active.value === true || lockType === "password");
  } catch {
    // key missing — first run, not locked
  }
}

watch(active, (newVal) => {
  chromeStorage.set("active", newVal);
});

onMounted(async () => {
  await loadData();
  loading.value = false;
});
</script>

<style scoped>
.page-container {
  height: 100%;
}

.loader {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.main-layout {
  height: 100%;
}

.sider-logo {
  padding: 16px;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #efeff5;
}

.logo-img {
  max-width: 120px;
  height: auto;
}

.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 28px;
  background-color: #fff;
  border-bottom: 2px solid #e8e8ec;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.header-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.active-label {
  font-size: 14px;
  font-weight: 500;
  color: #555;
}

.content-area {
  padding: 28px;
  max-width: 960px;
}
</style>

<style>
/* Active menu item — bold text + red left bar */
.n-menu-item-content--selected {
  position: relative;
  font-weight: 600 !important;
  color: #d32f2f !important;
}

.n-menu-item-content--selected::before {
  content: "";
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 3px;
  background-color: #d32f2f;
  border-radius: 0 3px 3px 0;
}

.n-menu-item-content {
  position: relative;
}
</style>
