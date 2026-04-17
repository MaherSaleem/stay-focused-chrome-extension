<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { NSwitch, NButton, NCard, NTag } from "naive-ui";
import {
  getFlatListOfWebsites,
  getHostNameFromStringUrl,
  isValidURL,
  setIcon,
} from "~/utils/helpers";
import { chromeStorage, getChromeActiveTab, openChromeNewTab } from "~/utils/storage";
import { makeSiteGroup, makeSite } from "~/utils/defaults";
import type { SiteGroup, Settings } from "~/utils/types";

const active = ref(false);
const websiteName = ref("");
const isLocked = ref(false);
const websiteIsAddedBefore = ref(false);

const isValidUrl = computed(() => isValidURL(websiteName.value));

function openOptionsPage() {
  openChromeNewTab("options/index.html");
}

async function saveActive() {
  await chromeStorage.set("active", active.value);
  setIcon(active.value);
}

async function addCurrentWebsite() {
  const sitesGroups = await chromeStorage.get<SiteGroup[]>("sitesGroups");
  let addedFromPopupSiteGroup = sitesGroups.find((sg) => sg.uid === "added-from-popup-uid");
  if (!addedFromPopupSiteGroup) {
    addedFromPopupSiteGroup = makeSiteGroup(
      "Added From Popup",
      true,
      [],
      "website",
      "added-from-popup-uid",
    );
    sitesGroups.push(addedFromPopupSiteGroup);
  }
  addedFromPopupSiteGroup.sitesList = [
    makeSite(websiteName.value),
    ...addedFromPopupSiteGroup.sitesList,
  ];
  await chromeStorage.set("sitesGroups", sitesGroups);
  websiteIsAddedBefore.value = true;
}

async function setWebsiteName() {
  const tab = await getChromeActiveTab();
  if (tab?.url) {
    websiteName.value = getHostNameFromStringUrl(tab.url);
    try {
      const sitesGroups = await chromeStorage.get<SiteGroup[]>("sitesGroups");
      websiteIsAddedBefore.value = getFlatListOfWebsites(sitesGroups).some(
        (site) => site.url === websiteName.value,
      );
    } catch {
      // No sites configured yet
    }
  }
}

onMounted(async () => {
  try {
    active.value = await chromeStorage.get<boolean>("active");
  } catch {
    // First run
  }
  if (active.value) {
    try {
      const settings = await chromeStorage.get<Settings>("settings");
      isLocked.value = settings.lock.type !== "none";
    } catch {
      // No settings yet
    }
  }
  await setWebsiteName();
});
</script>

<template>
  <div class="popup">
    <header>
      <img src="/images/logo-red-white.png" alt="Stay Focused" />
      <button class="settings-btn" @click="openOptionsPage" aria-label="Settings">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
          <path
            fill="#cecece"
            d="M15.95 10.78c.03-.25.05-.51.05-.78s-.02-.53-.06-.78l1.69-1.32c.15-.12.19-.34.1-.51l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L12 2.34c-.03-.2-.2-.34-.4-.34H8.4c-.2 0-.36.14-.39.34l-.3 2.12c-.49.2-.94.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.39.1.51l1.69 1.32c-.04.25-.07.52-.07.78s.02.53.06.78L2.37 12.1c-.15.12-.19.34-.1.51l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.34.4.34h3.2c.2 0 .37-.14.39-.34l.3-2.12c.49-.2.94-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.39-.1-.51l-1.67-1.32zM10 13c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"
          />
        </svg>
      </button>
    </header>

    <main>
      <n-card size="small">
        <div class="main-row center" v-if="isLocked && active">
          <p>Focus mode is enabled, and you have set lock mechanism to unlock</p>
          <n-button type="primary" @click="openOptionsPage">Unlock</n-button>
        </div>
        <div class="main-row" v-else>
          <p><b>Activate Focus Mode?</b></p>
          <n-switch v-model:value="active" @update:value="saveActive" />
        </div>
      </n-card>

      <n-card v-if="isValidUrl" size="small">
        <div class="main-row">
          <div><b>Website: </b>{{ websiteName }}</div>
          <div v-if="!websiteIsAddedBefore">
            <n-button type="primary" @click="addCurrentWebsite"> Add Website </n-button>
          </div>
          <n-tag v-else type="success">Already Added</n-tag>
        </div>
      </n-card>

      <n-card size="small">
        <div class="main-row">
          <BuyMeACoffee />
        </div>
      </n-card>
    </main>
  </div>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #323232;
  padding: 10px 5%;
}

header img {
  width: 150px;
  height: 25px;
}

.settings-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

main {
  display: flex;
  flex-direction: column;
  padding: 8px 5%;
  gap: 8px;
}

.main-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.main-row.center {
  flex-direction: column;
  justify-content: center;
  text-align: center;
  gap: 8px;
}
</style>
