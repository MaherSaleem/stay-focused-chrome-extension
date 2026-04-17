<template>
  <div class="page-container">
    <n-spin v-if="loading" :size="80" class="loader" />

    <UnlockPage v-else-if="isLocked" @unlock="handleUnlock" />

    <n-layout v-else has-sider class="main-layout">
      <n-layout-sider bordered :width="240" content-style="display: flex; flex-direction: column;">
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
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, h, type Component } from "vue";
import { NIcon } from "naive-ui";
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

function renderIcon(iconName: string) {
  return () =>
    h(NIcon, null, {
      default: () => h("span", { class: "material-icons", style: "font-size: 20px" }, iconName),
    });
}

const menuOptions = [
  {
    label: "Block By Website",
    key: "block-by-website",
    icon: renderIcon("move_to_inbox"),
  },
  {
    label: "Block Using a Word",
    key: "block-by-word",
    icon: renderIcon("sticky_note_2"),
  },
  {
    label: "Block Using Regex",
    key: "block-by-regex",
    icon: renderIcon("spellcheck"),
  },
  {
    label: "Settings",
    key: "settings",
    icon: renderIcon("settings"),
  },
  {
    label: "About",
    key: "about",
    icon: renderIcon("info"),
  },
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
  padding: 12px 24px;
  background-color: #fff;
  border-bottom: 1px solid #efeff5;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.active-label {
  font-size: 14px;
  color: #666;
}

.content-area {
  padding: 24px;
}
</style>
