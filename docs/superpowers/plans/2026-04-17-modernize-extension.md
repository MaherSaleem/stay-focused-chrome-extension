# Stay Focused Modernization — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port Stay Focused Chrome extension from Vue 2 / webpack 4 / Vue Material to WXT / Vue 3 / TypeScript / Naive UI while preserving all features and existing user data.

**Architecture:** WXT provides the extension framework (Vite-based build, manifest generation, HMR). Vue 3 with Composition API handles UI. Naive UI replaces Vue Material components. TypeScript types the entire codebase. Storage schema stays identical for backward compatibility.

**Tech Stack:** WXT, Vue 3, TypeScript, Naive UI, pnpm, plain CSS

**Spec:** `docs/superpowers/specs/2026-04-17-modernize-extension-design.md`

---

## File Structure

```
stay-focused-chrome-extension/
├── wxt.config.ts
├── package.json
├── tsconfig.json
├── assets/
│   ├── icons/                          # copied from src/icons/
│   └── images/                         # copied from src/images/
├── entrypoints/
│   ├── background.ts
│   ├── popup/
│   │   ├── index.html
│   │   ├── main.ts
│   │   ├── App.vue
│   │   └── style.css
│   ├── options/
│   │   ├── index.html
│   │   ├── main.ts
│   │   ├── App.vue
│   │   ├── style.css
│   │   └── components/
│   │       ├── BlockItemBaseTab.vue
│   │       ├── BlockByWebsiteTab.vue
│   │       ├── BlockByWordTab.vue
│   │       ├── BlockByRegexTab.vue
│   │       ├── SitesGroup.vue
│   │       ├── AddBlockItemToList.vue
│   │       ├── SettingsTab.vue
│   │       ├── AboutTab.vue
│   │       └── unlock/
│   │           ├── UnlockPage.vue
│   │           ├── PasswordUnlock.vue
│   │           ├── QuestionUnlock.vue
│   │           └── ClickButtonUnlock.vue
│   └── goback/
│       ├── index.html
│       ├── main.ts
│       ├── App.vue
│       └── style.css
├── components/
│   ├── CardWithLogo.vue
│   ├── BuyMeACoffee.vue
│   └── SocialMediaShare.vue
├── composables/
│   └── useStorage.ts
├── utils/
│   ├── storage.ts
│   ├── types.ts
│   ├── defaults.ts
│   ├── constants.ts
│   ├── helpers.ts
│   └── migration.ts
└── public/
    └── goback/
        └── images/                     # copied from src/goback/images/
```

---

## Task 1: Scaffold WXT project and configure dependencies

**Files:**
- Create: `wxt.config.ts`
- Create: `package.json` (new — replaces old)
- Create: `tsconfig.json`
- Remove: `webpack.config.js`, `.babelrc`, `scripts/build-zip.js`

- [ ] **Step 1: Back up old config files**

```bash
mkdir -p old-src-backup
cp package.json old-src-backup/
cp webpack.config.js old-src-backup/
cp .babelrc old-src-backup/
```

- [ ] **Step 2: Remove old config files**

```bash
rm webpack.config.js .babelrc
rm -rf scripts
```

- [ ] **Step 3: Create new `package.json`**

```json
{
  "name": "stay-focused",
  "version": "1.1.0",
  "description": "A Chrome extension to block distracting websites and keep you focused.",
  "author": "Maher Khdeir <maher.khdeir@gmail.com>",
  "license": "GPL-3.0",
  "type": "module",
  "scripts": {
    "dev": "wxt",
    "build": "wxt build",
    "zip": "wxt zip",
    "postinstall": "wxt prepare"
  }
}
```

- [ ] **Step 4: Install dependencies with pnpm**

```bash
pnpm init  # skip if package.json already created above
pnpm add vue naive-ui
pnpm add -D wxt @wxt-dev/module-vue typescript
```

- [ ] **Step 5: Create `wxt.config.ts`**

```ts
import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-vue"],
  manifest: {
    name: "Stay Focused",
    description:
      "Block distracting websites and get funny images to go back to work.",
    permissions: ["storage", "webNavigation", "tabs"],
    host_permissions: ["http://*/*", "https://*/*"],
    icons: {
      "16": "icons/icon_16.png",
      "32": "icons/icon_32.png",
      "48": "icons/icon_48_HQ.png",
      "128": "icons/icon_128.png",
    },
  },
});
```

- [ ] **Step 6: Create `tsconfig.json`**

```json
{
  "extends": "./.wxt/tsconfig.json"
}
```

- [ ] **Step 7: Run `wxt prepare` to generate types**

```bash
pnpm wxt prepare
```

Expected: `.wxt/` directory is created with type declarations.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold WXT project with Vue 3, TypeScript, Naive UI"
```

---

## Task 2: Copy static assets to new locations

**Files:**
- Create: `assets/icons/` (copy from `src/icons/`)
- Create: `assets/images/` (copy from `src/images/`)
- Create: `public/goback/images/` (copy from `src/goback/images/`)

- [ ] **Step 1: Copy icon files**

```bash
mkdir -p assets/icons
cp src/icons/icon_16.png assets/icons/
cp src/icons/icon_32.png assets/icons/
cp src/icons/icon_48_HQ.png assets/icons/
cp src/icons/icon_48_active.ico assets/icons/
cp src/icons/icon_48_inactive.ico assets/icons/
cp src/icons/icon_128.png assets/icons/
```

- [ ] **Step 2: Copy logo images**

```bash
mkdir -p assets/images
cp src/images/logo-red.png assets/images/
cp src/images/logo-red-white.png assets/images/
```

- [ ] **Step 3: Copy goback images to public/**

```bash
mkdir -p public/goback/images
cp src/goback/images/* public/goback/images/
```

- [ ] **Step 4: Verify all images are in place**

```bash
ls assets/icons/
ls assets/images/
ls public/goback/images/
```

- [ ] **Step 5: Commit**

```bash
git add assets/ public/
git commit -m "chore: copy static assets to WXT directory structure"
```

---

## Task 3: Create TypeScript types and utility modules

**Files:**
- Create: `utils/types.ts`
- Create: `utils/constants.ts`
- Create: `utils/storage.ts`
- Create: `utils/defaults.ts`
- Create: `utils/helpers.ts`
- Create: `utils/migration.ts`

- [ ] **Step 1: Create `utils/types.ts`**

```ts
export interface Site {
  url: string;
  enabled: boolean;
}

export interface SiteGroup {
  groupName: string;
  sitesList: Site[];
  uid: string;
  groupEnabled: boolean;
  blockType: "website" | "word" | "regex";
}

export type LockType = "none" | "password" | "question" | "click-button";

export interface LockSettings {
  type: LockType;
  password: string;
  questionNumberOfTries: number;
  clickButtonCounts: number;
}

export interface WorkHours {
  startTime: string; // "08:00 AM"
  endTime: string; // "05:00 PM"
  days: string[]; // ["1","2","3","4","5"]
  enableWorkHours: boolean;
}

export interface Settings {
  workHours: WorkHours;
  allowFunnyGoBackImages: boolean;
  lock: LockSettings;
}
```

- [ ] **Step 2: Create `utils/constants.ts`**

```ts
export const blockTypes = {
  website: "Website",
  word: "Word",
  regex: "Regex",
} as const;

export const skippedUrls = [
  "twitter.com/share",
  "facebook.com/sharer/sharer.php",
  "linkedin.com/shareArticle",
];
```

- [ ] **Step 3: Create `utils/storage.ts`**

```ts
/**
 * Typed wrapper around chrome.storage.local.
 * get() rejects when a key is missing (same behavior as the old codebase).
 * Components rely on this rejection to detect first-run and seed defaults.
 */
export const storage = {
  async get<T>(key: string): Promise<T> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (data) => {
        if (data[key] !== undefined) {
          resolve(data[key] as T);
        } else {
          reject("");
        }
      });
    });
  },

  async set(key: string, value: unknown): Promise<void> {
    await chrome.storage.local.set({ [key]: value });
  },
};

export async function getChromeActiveTab(): Promise<chrome.tabs.Tab> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
}

export function openChromeNewTab(url: string): void {
  chrome.tabs.create({ url });
}

export function setExtensionIcon(iconPath: string): void {
  chrome.action.setIcon({ path: iconPath });
}
```

- [ ] **Step 4: Create `utils/helpers.ts`**

```ts
import type { SiteGroup, Site } from "./types";
import { setExtensionIcon } from "./storage";

export function isValidURL(str: string): boolean {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i",
  );
  return pattern.test(str);
}

export function getHostNameFromStringUrl(url: string): string {
  const a = document.createElement("a");
  if (!url.startsWith("http")) {
    url = "http://" + url;
  }
  a.href = url;
  let hostName = a.hostname;
  if (hostName.startsWith("www.")) {
    hostName = hostName.substring(4);
  }
  return hostName;
}

export function isTodayOneOfTheseDays(days: string[]): boolean {
  const dayIndex = new Date().getDay();
  return days.includes(dayIndex.toString());
}

export function isCurrentTimeBetweenTwoTimes(
  startTime: string,
  endTime: string,
): boolean {
  const currentDate = new Date();
  const convertTimeToDate = (timeString: string): Date => {
    const timeAsDate = new Date(currentDate.getTime());
    timeAsDate.setHours(parseInt(timeString.substring(0, 2)));
    timeAsDate.setMinutes(parseInt(timeString.substring(3, 5)));
    timeAsDate.setSeconds(0);
    const isPM = timeString.substring(6, 8) === "PM";
    if (isPM) {
      timeAsDate.setHours(timeAsDate.getHours() + 12);
    }
    return timeAsDate;
  };
  const startTimeAsDate = convertTimeToDate(startTime);
  const endTimeAsDate = convertTimeToDate(endTime);
  return startTimeAsDate < currentDate && endTimeAsDate > currentDate;
}

export function setIcon(isActive: boolean): void {
  const iconPath = isActive
    ? "/icons/icon_48_active.ico"
    : "/icons/icon_48_inactive.ico";
  setExtensionIcon(iconPath);
}

export function getFlatEnabledListOfWebsites(
  groupsList: SiteGroup[],
): Array<Site & { groupEnabled: boolean; blockType: string }> {
  return getFlatListOfWebsites(groupsList).filter(
    (site) => site.groupEnabled && site.enabled,
  );
}

export function getFlatListOfWebsites(
  groupsList: SiteGroup[],
): Array<Site & { groupEnabled: boolean; blockType: string }> {
  const flatList: Array<Site & { groupEnabled: boolean; blockType: string }> =
    [];
  groupsList.forEach((siteGroup) => {
    flatList.push(
      ...siteGroup.sitesList.map((site) => ({
        ...site,
        groupEnabled: siteGroup.groupEnabled,
        blockType: siteGroup.blockType,
      })),
    );
  });
  return flatList;
}

export function getUniqueId(numberOfChars = 6): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < numberOfChars; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function truncateText(value: string, charsLength = 30): string {
  return value.length <= charsLength
    ? value
    : value.substring(0, charsLength) + "...";
}

export function regexMatch(stringToTest: string, regexString: string): boolean {
  const re = new RegExp(regexString);
  return re.test(stringToTest);
}

export function versionCompare(v1: string, v2: string): number {
  const v1parts = v1.split(".").map(Number);
  const v2parts = v2.split(".").map(Number);
  for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
    const a = v1parts[i] ?? 0;
    const b = v2parts[i] ?? 0;
    if (a > b) return 1;
    if (a < b) return -1;
  }
  return 0;
}
```

- [ ] **Step 5: Create `utils/defaults.ts`**

```ts
import type { SiteGroup, Settings } from "./types";
import { getUniqueId } from "./helpers";

function makeSiteGroup(
  groupName: string,
  enabled: boolean,
  sites: Array<{ url: string; enabled: boolean }> = [],
  blockType: "website" | "word" | "regex" = "website",
  uid: string = getUniqueId(),
): SiteGroup {
  return { groupName, sitesList: sites, uid, groupEnabled: enabled, blockType };
}

function makeSite(url: string, enabled = true) {
  return { url, enabled };
}

export const settingsDefault: Settings = {
  workHours: {
    startTime: "08:00 AM",
    endTime: "05:00 PM",
    days: ["1", "2", "3", "4", "5"],
    enableWorkHours: false,
  },
  allowFunnyGoBackImages: true,
  lock: {
    type: "click-button",
    password: "",
    questionNumberOfTries: 3,
    clickButtonCounts: 8,
  },
};

export const websitesListDefault: SiteGroup[] = [
  makeSiteGroup("Social Media Sites", true, [
    makeSite("facebook.com"),
    makeSite("twitter.com"),
    makeSite("x.com"),
    makeSite("instagram.com"),
    makeSite("linkedin.com"),
  ]),
  makeSiteGroup("Videos Sites", false, [
    makeSite("youtube.com"),
    makeSite("netflix.com"),
    makeSite("dailymotion.com"),
  ]),
  makeSiteGroup("Blocked Using a Word", true, [], "word"),
  makeSiteGroup("Blocked Using Regex", true, [], "regex"),
];

export const activeDefault = false;

export { makeSiteGroup, makeSite };
```

- [ ] **Step 6: Create `utils/migration.ts`**

```ts
import { versionCompare } from "./helpers";
import { storage } from "./storage";
import { makeSiteGroup } from "./defaults";
import type { SiteGroup } from "./types";

export async function handle103To104Upgrade(
  previousVersion: string,
  currentVersion: string,
): Promise<void> {
  if (
    versionCompare(previousVersion, "1.0.3") <= 0 &&
    versionCompare(currentVersion, "1.0.4") >= 0
  ) {
    const sitesGroups = await storage.get<SiteGroup[]>("sitesGroups");
    const newSitesGroups = sitesGroups.map((sg) => ({
      ...sg,
      blockType: sg.blockType ?? ("website" as const),
    }));
    newSitesGroups.push(makeSiteGroup("Blocked By Word", true, [], "word"));
    newSitesGroups.push(makeSiteGroup("Blocked By Regex", true, [], "regex"));
    await storage.set("sitesGroups", newSitesGroups);
  }
}
```

- [ ] **Step 7: Commit**

```bash
git add utils/
git commit -m "feat: add typed utility modules (storage, helpers, types, defaults, migration)"
```

---

## Task 4: Create the `useStorage` composable

**Files:**
- Create: `composables/useStorage.ts`

- [ ] **Step 1: Create `composables/useStorage.ts`**

This composable provides a reactive `ref` backed by `chrome.storage.local`, used by popup and options Vue components.

```ts
import { ref, watch, type Ref } from "vue";
import { storage } from "~/utils/storage";

/**
 * Reactive wrapper around chrome.storage.local.
 * Returns a ref that stays in sync with storage.
 * On first call, loads the value from storage (or uses fallback if key is missing).
 */
export function useStorage<T>(key: string, fallback: T): Ref<T> {
  const data = ref<T>(fallback) as Ref<T>;
  let skipNextWatch = false;

  // Load initial value
  storage
    .get<T>(key)
    .then((value) => {
      skipNextWatch = true;
      data.value = value;
    })
    .catch(() => {
      // Key not in storage — use fallback (first-run scenario)
    });

  // Write back to storage on changes
  watch(data, (newValue) => {
    if (skipNextWatch) {
      skipNextWatch = false;
      return;
    }
    storage.set(key, newValue);
  }, { deep: true });

  return data;
}
```

- [ ] **Step 2: Commit**

```bash
git add composables/
git commit -m "feat: add useStorage composable for reactive chrome.storage.local"
```

---

## Task 5: Create the background service worker

**Files:**
- Create: `entrypoints/background.ts`

- [ ] **Step 1: Create `entrypoints/background.ts`**

```ts
import { storage } from "~/utils/storage";
import { skippedUrls } from "~/utils/constants";
import {
  getFlatEnabledListOfWebsites,
  isCurrentTimeBetweenTwoTimes,
  isTodayOneOfTheseDays,
  isValidURL,
  regexMatch,
  setIcon,
} from "~/utils/helpers";
import {
  settingsDefault,
  websitesListDefault,
  activeDefault,
} from "~/utils/defaults";
import { handle103To104Upgrade } from "~/utils/migration";
import type { Settings, SiteGroup } from "~/utils/types";

export default defineBackground({
  main() {
    const chooseIconColor = async () => {
      try {
        const active = await storage.get<boolean>("active");
        setIcon(active);
      } catch {
        setIcon(false);
      }
    };

    const checkIfMatch = (
      blockItem: { blockType: string; url: string },
      url: string,
    ): boolean => {
      if (skippedUrls.some((skippedUrl) => url.includes(skippedUrl))) {
        return false;
      }
      if (blockItem.blockType === "regex") {
        return regexMatch(url, blockItem.url);
      }
      return url.includes(blockItem.url);
    };

    const checkIfCanEnterWebsite = async (
      info: chrome.webNavigation.WebNavigationTransitionCallbackDetails,
    ) => {
      if (info.frameId !== 0 || !isValidURL(info.url)) {
        return;
      }

      let isExtensionActive: boolean;
      try {
        isExtensionActive = await storage.get<boolean>("active");
      } catch {
        return;
      }
      if (!isExtensionActive) {
        return;
      }

      try {
        const settings = await storage.get<Settings>("settings");
        if (settings.workHours?.enableWorkHours) {
          const isWorkDay = isTodayOneOfTheseDays(settings.workHours.days);
          const isWithinWorkTime = isCurrentTimeBetweenTwoTimes(
            settings.workHours.startTime,
            settings.workHours.endTime,
          );
          if (!(isWorkDay && isWithinWorkTime)) {
            return;
          }
        }
      } catch {
        return;
      }

      try {
        const sitesGroups = await storage.get<SiteGroup[]>("sitesGroups");
        const blockedWebsites = getFlatEnabledListOfWebsites(sitesGroups);
        const isBlocked = blockedWebsites.some((website) =>
          checkIfMatch(website, info.url),
        );
        if (isBlocked) {
          await chrome.tabs.update(info.tabId, { url: "/goback/index.html" });
        }
      } catch {
        // No sites configured
      }
    };

    chrome.webNavigation.onCommitted.addListener(checkIfCanEnterWebsite);
    chrome.webNavigation.onCommitted.addListener(chooseIconColor);

    chrome.runtime.onInstalled.addListener(async (details) => {
      const currentVersion = chrome.runtime.getManifest().version;
      const previousVersion = details.previousVersion;
      await storage.set("version", currentVersion);

      switch (details.reason) {
        case "install":
          await storage.set("sitesGroups", websitesListDefault);
          await storage.set("settings", settingsDefault);
          await storage.set("active", activeDefault);
          console.log("Installed Successfully");
          break;
        case "update":
          console.log(
            `prev version: ${previousVersion}, current version: ${currentVersion}`,
          );
          if (previousVersion) {
            await handle103To104Upgrade(previousVersion, currentVersion);
          }
          console.log("Updated Successfully");
          break;
      }
    });
  },
});
```

- [ ] **Step 2: Verify the build compiles**

```bash
pnpm wxt prepare
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add entrypoints/background.ts
git commit -m "feat: port background service worker to TypeScript with WXT"
```

---

## Task 6: Create the goback page

**Files:**
- Create: `entrypoints/goback/index.html`
- Create: `entrypoints/goback/main.ts`
- Create: `entrypoints/goback/App.vue`
- Create: `entrypoints/goback/style.css`

- [ ] **Step 1: Create `entrypoints/goback/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Go Back to Work!</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

- [ ] **Step 2: Create `entrypoints/goback/main.ts`**

```ts
import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

createApp(App).mount("#app");
```

- [ ] **Step 3: Create `entrypoints/goback/App.vue`**

```vue
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
      <img
        class="logo"
        src="~/assets/images/logo-red.png"
        alt="Stay Focused"
      />
      <h2 v-if="randomImage.text">{{ randomImage.text }}</h2>
      <img
        class="goback-image"
        :src="randomImage.path"
        alt="Go back to work"
      />
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
```

- [ ] **Step 4: Create `entrypoints/goback/style.css`**

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background-color: #f5f5f5;
}
```

- [ ] **Step 5: Commit**

```bash
git add entrypoints/goback/
git commit -m "feat: port goback page to Vue 3 SFC"
```

---

## Task 7: Create shared components

**Files:**
- Create: `components/CardWithLogo.vue`
- Create: `components/BuyMeACoffee.vue`
- Create: `components/SocialMediaShare.vue`

- [ ] **Step 1: Read the current shared components for reference**

Read these files to port them:
- `src/sharedComponents/CardWithLogo.vue`
- `src/sharedComponents/BuyMeACoffee.vue`
- `src/sharedComponents/SocialMediaShare.vue`

- [ ] **Step 2: Create `components/CardWithLogo.vue`**

```vue
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
```

- [ ] **Step 3: Create `components/BuyMeACoffee.vue`**

Read `src/sharedComponents/BuyMeACoffee.vue` first, then port. The component contains a "Buy Me a Coffee" link with an image. Port as:

```vue
<script setup lang="ts">
</script>

<template>
  <a
    href="https://www.buymeacoffee.com/mahersaleem"
    target="_blank"
    rel="noopener noreferrer"
    class="bmc-link"
  >
    <img
      src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
      alt="Buy Me A Coffee"
      class="bmc-image"
    />
  </a>
</template>

<style scoped>
.bmc-link {
  display: inline-block;
}

.bmc-image {
  height: 40px;
  width: auto;
}
</style>
```

Note: Read the actual `BuyMeACoffee.vue` source to get the exact URL and image. The above is a best-guess port — verify against the original.

- [ ] **Step 4: Create `components/SocialMediaShare.vue`**

Read `src/sharedComponents/SocialMediaShare.vue` first, then port to plain `<a>` tags. The original uses `vue-share-buttons` — replace with direct share URLs:

```vue
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
```

- [ ] **Step 5: Commit**

```bash
git add components/
git commit -m "feat: port shared components (CardWithLogo, BuyMeACoffee, SocialMediaShare)"
```

---

## Task 8: Create the popup page

**Files:**
- Create: `entrypoints/popup/index.html`
- Create: `entrypoints/popup/main.ts`
- Create: `entrypoints/popup/App.vue`
- Create: `entrypoints/popup/style.css`

- [ ] **Step 1: Create `entrypoints/popup/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Stay Focused</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

- [ ] **Step 2: Create `entrypoints/popup/main.ts`**

```ts
import { createApp } from "vue";
import {
  create,
  NSwitch,
  NButton,
  NCard,
  NBadge,
} from "naive-ui";
import App from "./App.vue";
import "./style.css";

const naive = create({ components: [NSwitch, NButton, NCard, NBadge] });
const app = createApp(App);
app.use(naive);
app.mount("#app");
```

- [ ] **Step 3: Create `entrypoints/popup/App.vue`**

```vue
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import {
  getFlatListOfWebsites,
  getHostNameFromStringUrl,
  isValidURL,
  setIcon,
} from "~/utils/helpers";
import {
  storage,
  getChromeActiveTab,
  openChromeNewTab,
} from "~/utils/storage";
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
  await storage.set("active", active.value);
  setIcon(active.value);
}

async function addCurrentWebsite() {
  const sitesGroups = await storage.get<SiteGroup[]>("sitesGroups");
  let addedFromPopupSiteGroup = sitesGroups.find(
    (sg) => sg.uid === "added-from-popup-uid",
  );
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
  await storage.set("sitesGroups", sitesGroups);
  websiteIsAddedBefore.value = true;
}

async function setWebsiteName() {
  const tab = await getChromeActiveTab();
  if (tab?.url) {
    websiteName.value = getHostNameFromStringUrl(tab.url);
    try {
      const sitesGroups = await storage.get<SiteGroup[]>("sitesGroups");
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
    active.value = await storage.get<boolean>("active");
  } catch {
    // First run
  }
  if (active.value) {
    try {
      const settings = await storage.get<Settings>("settings");
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
      <img src="~/assets/images/logo-red-white.png" alt="Stay Focused" />
      <button class="settings-btn" @click="openOptionsPage" aria-label="Settings">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
          <path fill="#cecece" d="M15.95 10.78c.03-.25.05-.51.05-.78s-.02-.53-.06-.78l1.69-1.32c.15-.12.19-.34.1-.51l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L12 2.34c-.03-.2-.2-.34-.4-.34H8.4c-.2 0-.36.14-.39.34l-.3 2.12c-.49.2-.94.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.39.1.51l1.69 1.32c-.04.25-.07.52-.07.78s.02.53.06.78L2.37 12.1c-.15.12-.19.34-.1.51l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.34.4.34h3.2c.2 0 .37-.14.39-.34l.3-2.12c.49-.2.94-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.39-.1-.51l-1.67-1.32zM10 13c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
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
            <n-button type="primary" @click="addCurrentWebsite">
              Add Website
            </n-button>
          </div>
          <n-badge v-else value="Already Added" type="success" />
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
```

- [ ] **Step 4: Create `entrypoints/popup/style.css`**

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  width: 350px;
  min-height: 200px;
}
```

- [ ] **Step 5: Commit**

```bash
git add entrypoints/popup/
git commit -m "feat: port popup page to Vue 3 + Naive UI"
```

---

## Task 9: Create the options page — unlock components

**Files:**
- Create: `entrypoints/options/components/unlock/UnlockPage.vue`
- Create: `entrypoints/options/components/unlock/PasswordUnlock.vue`
- Create: `entrypoints/options/components/unlock/QuestionUnlock.vue`
- Create: `entrypoints/options/components/unlock/ClickButtonUnlock.vue`

- [ ] **Step 1: Read existing unlock components**

Read these files to understand the unlock logic:
- `src/options/unlock/UnlockPage.vue`
- `src/options/unlock/PasswordUnlock.vue`
- `src/options/unlock/QuestionUnlock.vue`
- `src/options/unlock/ClickButtonUnlock.vue`

- [ ] **Step 2: Create `PasswordUnlock.vue`**

Read `src/options/unlock/PasswordUnlock.vue` and port to Vue 3. This component asks the user to type the password they set. On correct entry, emits `unlock`.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { NInput, NButton } from "naive-ui";
import { storage } from "~/utils/storage";
import type { Settings } from "~/utils/types";

const emit = defineEmits<{ unlock: [] }>();
const password = ref("");
const error = ref("");

async function checkPassword() {
  const settings = await storage.get<Settings>("settings");
  if (password.value === settings.lock.password) {
    emit("unlock");
  } else {
    error.value = "Incorrect password";
    password.value = "";
  }
}
</script>

<template>
  <div class="password-unlock">
    <h3>Enter your password to unlock</h3>
    <n-input
      v-model:value="password"
      type="password"
      placeholder="Password"
      @keyup.enter="checkPassword"
    />
    <p v-if="error" class="error">{{ error }}</p>
    <n-button type="primary" @click="checkPassword">Unlock</n-button>
  </div>
</template>

<style scoped>
.password-unlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
}

.error {
  color: #d03050;
}
</style>
```

- [ ] **Step 3: Create `QuestionUnlock.vue`**

Read `src/options/unlock/QuestionUnlock.vue` and port. This component asks a math question the user must answer correctly N times.

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { NInput, NButton } from "naive-ui";
import { storage } from "~/utils/storage";
import type { Settings } from "~/utils/types";

const emit = defineEmits<{ unlock: [] }>();
const answer = ref("");
const error = ref("");
const remainingTries = ref(3);
const num1 = ref(0);
const num2 = ref(0);

const expectedAnswer = computed(() => num1.value + num2.value);

function generateQuestion() {
  num1.value = Math.floor(Math.random() * 50) + 10;
  num2.value = Math.floor(Math.random() * 50) + 10;
}

function checkAnswer() {
  if (parseInt(answer.value) === expectedAnswer.value) {
    remainingTries.value--;
    if (remainingTries.value <= 0) {
      emit("unlock");
    } else {
      generateQuestion();
      answer.value = "";
      error.value = "";
    }
  } else {
    error.value = "Wrong answer, try again";
    answer.value = "";
  }
}

onMounted(async () => {
  try {
    const settings = await storage.get<Settings>("settings");
    remainingTries.value = settings.lock.questionNumberOfTries;
  } catch {
    // Use default
  }
  generateQuestion();
});
</script>

<template>
  <div class="question-unlock">
    <h3>Answer to unlock ({{ remainingTries }} remaining)</h3>
    <p class="question">What is {{ num1 }} + {{ num2 }}?</p>
    <n-input
      v-model:value="answer"
      placeholder="Your answer"
      @keyup.enter="checkAnswer"
    />
    <p v-if="error" class="error">{{ error }}</p>
    <n-button type="primary" @click="checkAnswer">Submit</n-button>
  </div>
</template>

<style scoped>
.question-unlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
}

.question {
  font-size: 18px;
  font-weight: 500;
}

.error {
  color: #d03050;
}
</style>
```

- [ ] **Step 4: Create `ClickButtonUnlock.vue`**

Read `src/options/unlock/ClickButtonUnlock.vue` and port. This component shows a moving button the user must click N times.

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { NButton } from "naive-ui";
import { storage } from "~/utils/storage";
import type { Settings } from "~/utils/types";

const emit = defineEmits<{ unlock: [] }>();
const remainingClicks = ref(8);
const buttonStyle = ref({ top: "50%", left: "50%" });

function moveButton() {
  const top = Math.floor(Math.random() * 80) + 10;
  const left = Math.floor(Math.random() * 80) + 10;
  buttonStyle.value = { top: `${top}%`, left: `${left}%` };
}

function handleClick() {
  remainingClicks.value--;
  if (remainingClicks.value <= 0) {
    emit("unlock");
  } else {
    moveButton();
  }
}

onMounted(async () => {
  try {
    const settings = await storage.get<Settings>("settings");
    remainingClicks.value = settings.lock.clickButtonCounts;
  } catch {
    // Use default
  }
  moveButton();
});
</script>

<template>
  <div class="click-unlock">
    <h3>Click the button {{ remainingClicks }} more times to unlock</h3>
    <div class="button-area">
      <n-button
        type="primary"
        :style="{ position: 'absolute', ...buttonStyle }"
        @click="handleClick"
      >
        Click Me!
      </n-button>
    </div>
  </div>
</template>

<style scoped>
.click-unlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
}

.button-area {
  position: relative;
  width: 100%;
  height: 300px;
  border: 1px dashed #ccc;
  border-radius: 8px;
}
</style>
```

- [ ] **Step 5: Create `UnlockPage.vue`**

Read `src/options/unlock/UnlockPage.vue` and port. This component picks the right unlock method based on `settings.lock.type`.

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storage } from "~/utils/storage";
import type { Settings, LockType } from "~/utils/types";
import PasswordUnlock from "./PasswordUnlock.vue";
import QuestionUnlock from "./QuestionUnlock.vue";
import ClickButtonUnlock from "./ClickButtonUnlock.vue";

const emit = defineEmits<{ unlock: [] }>();
const lockType = ref<LockType>("click-button");

onMounted(async () => {
  try {
    const settings = await storage.get<Settings>("settings");
    lockType.value = settings.lock.type;
  } catch {
    // Use default
  }
});

function handleUnlock() {
  emit("unlock");
}
</script>

<template>
  <div class="unlock-page">
    <PasswordUnlock v-if="lockType === 'password'" @unlock="handleUnlock" />
    <QuestionUnlock
      v-else-if="lockType === 'question'"
      @unlock="handleUnlock"
    />
    <ClickButtonUnlock v-else @unlock="handleUnlock" />
  </div>
</template>

<style scoped>
.unlock-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>
```

- [ ] **Step 6: Commit**

```bash
git add entrypoints/options/components/unlock/
git commit -m "feat: port unlock components (password, question, click-button) to Vue 3"
```

---

## Task 10: Create the options page — block list components

**Files:**
- Create: `entrypoints/options/components/AddBlockItemToList.vue`
- Create: `entrypoints/options/components/SitesGroup.vue`
- Create: `entrypoints/options/components/BlockItemBaseTab.vue`
- Create: `entrypoints/options/components/BlockByWebsiteTab.vue`
- Create: `entrypoints/options/components/BlockByWordTab.vue`
- Create: `entrypoints/options/components/BlockByRegexTab.vue`

- [ ] **Step 1: Read existing block list components**

Read these files:
- `src/options/BlockItemTabs/AddBlockItemToList.vue`
- `src/options/BlockItemTabs/SitesGroup.vue`
- `src/options/BlockItemTabs/BlockItemBaseTab.vue`
- `src/options/BlockItemTabs/BlockByWebsiteTab.vue`
- `src/options/BlockItemTabs/BlockByWordTab.vue`
- `src/options/BlockItemTabs/BlockByRegexTab.vue`

- [ ] **Step 2: Create `AddBlockItemToList.vue`**

Port from `src/options/BlockItemTabs/AddBlockItemToList.vue`. This is the input row for adding a new site to a group.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { NInput, NButton } from "naive-ui";

const props = defineProps<{
  blockType: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  addSite: [{ siteUrl: string; blockType: string }];
}>();

const siteUrl = ref("");

function addSite() {
  if (!siteUrl.value.trim()) return;
  emit("addSite", { siteUrl: siteUrl.value.trim(), blockType: props.blockType });
  siteUrl.value = "";
}
</script>

<template>
  <div class="add-block-item">
    <n-input
      v-model:value="siteUrl"
      :placeholder="placeholder || 'Enter URL'"
      @keyup.enter="addSite"
    />
    <n-button type="primary" @click="addSite">Add</n-button>
  </div>
</template>

<style scoped>
.add-block-item {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
</style>
```

- [ ] **Step 3: Create `SitesGroup.vue`**

Port from `src/options/BlockItemTabs/SitesGroup.vue`. Displays one group with its sites, toggles, and delete buttons.

```vue
<script setup lang="ts">
import { NSwitch, NButton, NCard, NIcon } from "naive-ui";
import { truncateText } from "~/utils/helpers";
import type { SiteGroup } from "~/utils/types";
import AddBlockItemToList from "./AddBlockItemToList.vue";

const props = defineProps<{
  sitesGroup: SiteGroup;
  allowDelete: boolean;
}>();

const emit = defineEmits<{
  storeWebsites: [];
  addNewWebsite: [{ siteUrl: string; blockType: string }];
  deleteSitesGroup: [];
  deleteSite: [number];
}>();

function toggleGroupEnabled() {
  emit("storeWebsites");
}

function toggleSiteEnabled() {
  emit("storeWebsites");
}
</script>

<template>
  <n-card class="sites-group" :title="sitesGroup.groupName" size="small">
    <template #header-extra>
      <n-switch
        v-model:value="sitesGroup.groupEnabled"
        @update:value="toggleGroupEnabled"
        size="small"
      />
      <n-button
        v-if="allowDelete"
        text
        type="error"
        size="small"
        @click="emit('deleteSitesGroup')"
        style="margin-left: 8px"
      >
        Delete Group
      </n-button>
    </template>

    <AddBlockItemToList
      :block-type="sitesGroup.blockType"
      @add-site="(data) => emit('addNewWebsite', data)"
    />

    <div class="sites-list">
      <div
        v-for="(site, index) in sitesGroup.sitesList"
        :key="index"
        class="site-row"
      >
        <n-switch
          v-model:value="site.enabled"
          @update:value="toggleSiteEnabled"
          size="small"
        />
        <span class="site-url">{{ truncateText(site.url) }}</span>
        <n-button text type="error" size="tiny" @click="emit('deleteSite', index)">
          Remove
        </n-button>
      </div>
    </div>
  </n-card>
</template>

<style scoped>
.sites-group {
  width: 48%;
  min-width: 300px;
  margin: 8px;
}

.sites-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.site-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.site-url {
  flex: 1;
  font-size: 14px;
}
</style>
```

- [ ] **Step 4: Create `BlockItemBaseTab.vue`**

Port from `src/options/BlockItemTabs/BlockItemBaseTab.vue`. Centralizes CRUD logic for all block tabs.

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { NInput } from "naive-ui";
import { storage } from "~/utils/storage";
import { getHostNameFromStringUrl } from "~/utils/helpers";
import { websitesListDefault, makeSiteGroup, makeSite } from "~/utils/defaults";
import type { SiteGroup } from "~/utils/types";
import SitesGroupComponent from "./SitesGroup.vue";

const props = withDefaults(
  defineProps<{
    blockTypeToShow: string;
    allowCreateNewGroups?: boolean;
    allowDeleteGroups?: boolean;
  }>(),
  {
    allowCreateNewGroups: true,
    allowDeleteGroups: true,
  },
);

const sitesGroups = ref<SiteGroup[]>(websitesListDefault);
const newGroupName = ref("");

const toShowSitesGroups = computed(() =>
  sitesGroups.value.filter((sg) => sg.blockType === props.blockTypeToShow),
);

function findGroupIndexByUid(uid: string): number {
  return sitesGroups.value.findIndex((sg) => sg.uid === uid);
}

function loadWebsites() {
  storage
    .get<SiteGroup[]>("sitesGroups")
    .then((data) => {
      sitesGroups.value = data;
    })
    .catch(() => {
      storeWebsites(); // first run — seed defaults
    });
}

function storeWebsites() {
  storage.set("sitesGroups", sitesGroups.value);
}

function addNewSite(
  groupUid: string,
  siteData: { siteUrl: string; blockType: string },
) {
  const groupIndex = findGroupIndexByUid(groupUid);
  let { siteUrl, blockType } = siteData;
  if (blockType === "website") {
    siteUrl = getHostNameFromStringUrl(siteUrl);
  }
  const group = sitesGroups.value[groupIndex];
  group.sitesList = [makeSite(siteUrl), ...group.sitesList];
  storeWebsites();
}

function addNewGroup() {
  if (!newGroupName.value.trim()) return;
  sitesGroups.value = [
    makeSiteGroup(newGroupName.value, true, [], props.blockTypeToShow as SiteGroup["blockType"]),
    ...sitesGroups.value,
  ];
  newGroupName.value = "";
  storeWebsites();
}

function deleteGroup(groupUid: string) {
  const groupIndex = findGroupIndexByUid(groupUid);
  sitesGroups.value.splice(groupIndex, 1);
  storeWebsites();
}

function deleteSite(groupUid: string, siteIndex: number) {
  const groupIndex = findGroupIndexByUid(groupUid);
  setTimeout(() => {
    sitesGroups.value[groupIndex].sitesList.splice(siteIndex, 1);
    storeWebsites();
  }, 10);
}

onMounted(() => {
  loadWebsites();
});
</script>

<template>
  <div>
    <slot name="note" />

    <div v-if="allowCreateNewGroups" class="new-group-input">
      <n-input
        v-model:value="newGroupName"
        placeholder="Enter a name for the new website group (ex: E-Commerce)"
        @keyup.enter="addNewGroup"
      />
    </div>

    <div class="sites-groups">
      <SitesGroupComponent
        v-for="sg in toShowSitesGroups"
        :key="sg.uid"
        :sites-group="sg"
        :allow-delete="allowDeleteGroups"
        @store-websites="storeWebsites"
        @add-new-website="(data) => addNewSite(sg.uid, data)"
        @delete-sites-group="deleteGroup(sg.uid)"
        @delete-site="(index) => deleteSite(sg.uid, index)"
      />
    </div>
  </div>
</template>

<style scoped>
.new-group-input {
  max-width: 50%;
  margin-bottom: 16px;
  margin-left: 1%;
}

.sites-groups {
  display: flex;
  flex-wrap: wrap;
}
</style>
```

- [ ] **Step 5: Create `BlockByWebsiteTab.vue`**

```vue
<script setup lang="ts">
import BlockItemBaseTab from "./BlockItemBaseTab.vue";
</script>

<template>
  <BlockItemBaseTab block-type-to-show="website" />
</template>
```

- [ ] **Step 6: Create `BlockByWordTab.vue`**

```vue
<script setup lang="ts">
import BlockItemBaseTab from "./BlockItemBaseTab.vue";
</script>

<template>
  <BlockItemBaseTab block-type-to-show="word" :allow-create-new-groups="false" :allow-delete-groups="false">
    <template #note>
      <p class="note">Websites containing any of the words below will be blocked.</p>
    </template>
  </BlockItemBaseTab>
</template>

<style scoped>
.note {
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 16px;
  margin-left: 1%;
  font-size: 14px;
}
</style>
```

- [ ] **Step 7: Create `BlockByRegexTab.vue`**

```vue
<script setup lang="ts">
import BlockItemBaseTab from "./BlockItemBaseTab.vue";
</script>

<template>
  <BlockItemBaseTab block-type-to-show="regex" :allow-create-new-groups="false" :allow-delete-groups="false">
    <template #note>
      <p class="note">Websites matching any of the regular expressions below will be blocked.</p>
    </template>
  </BlockItemBaseTab>
</template>

<style scoped>
.note {
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 16px;
  margin-left: 1%;
  font-size: 14px;
}
</style>
```

- [ ] **Step 8: Commit**

```bash
git add entrypoints/options/components/AddBlockItemToList.vue \
  entrypoints/options/components/SitesGroup.vue \
  entrypoints/options/components/BlockItemBaseTab.vue \
  entrypoints/options/components/BlockByWebsiteTab.vue \
  entrypoints/options/components/BlockByWordTab.vue \
  entrypoints/options/components/BlockByRegexTab.vue
git commit -m "feat: port block list tab components to Vue 3 + Naive UI"
```

---

## Task 11: Create the options page — settings and about tabs

**Files:**
- Create: `entrypoints/options/components/SettingsTab.vue`
- Create: `entrypoints/options/components/AboutTab.vue`

- [ ] **Step 1: Read existing settings and about tabs**

Read:
- `src/options/SettingsTab.vue`
- `src/options/AboutTab.vue`

- [ ] **Step 2: Create `SettingsTab.vue`**

Port from `src/options/SettingsTab.vue`. Uses Naive UI components for work hours, lock settings.

```vue
<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import {
  NSwitch,
  NCheckboxGroup,
  NCheckbox,
  NTimePicker,
  NRadioGroup,
  NRadio,
  NInput,
  NInputNumber,
  NCard,
} from "naive-ui";
import { storage } from "~/utils/storage";
import { settingsDefault } from "~/utils/defaults";
import type { Settings, LockType } from "~/utils/types";

const emit = defineEmits<{ reloadData: [] }>();
const settings = ref<Settings>(structuredClone(settingsDefault));

const dayOptions = [
  { label: "Sunday", value: "0" },
  { label: "Monday", value: "1" },
  { label: "Tuesday", value: "2" },
  { label: "Wednesday", value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday", value: "5" },
  { label: "Saturday", value: "6" },
];

// Naive UI n-time-picker works with timestamps (ms since midnight).
// Convert "08:00 AM" string ↔ ms.
function timeStringToMs(time: string): number {
  let hours = parseInt(time.substring(0, 2));
  const minutes = parseInt(time.substring(3, 5));
  const isPM = time.substring(6, 8) === "PM";
  if (isPM && hours !== 12) hours += 12;
  if (!isPM && hours === 12) hours = 0;
  return (hours * 60 + minutes) * 60 * 1000;
}

function msToTimeString(ms: number): string {
  let totalMinutes = Math.floor(ms / 60000);
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const isPM = hours >= 12;
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  const hh = hours.toString().padStart(2, "0");
  const mm = minutes.toString().padStart(2, "0");
  return `${hh}:${mm} ${isPM ? "PM" : "AM"}`;
}

const startTimeMs = ref(timeStringToMs(settings.value.workHours.startTime));
const endTimeMs = ref(timeStringToMs(settings.value.workHours.endTime));

function saveSettings() {
  settings.value.workHours.startTime = msToTimeString(startTimeMs.value);
  settings.value.workHours.endTime = msToTimeString(endTimeMs.value);
  storage.set("settings", settings.value);
}

watch(settings, saveSettings, { deep: true });
watch(startTimeMs, saveSettings);
watch(endTimeMs, saveSettings);

onMounted(async () => {
  try {
    settings.value = await storage.get<Settings>("settings");
    startTimeMs.value = timeStringToMs(settings.value.workHours.startTime);
    endTimeMs.value = timeStringToMs(settings.value.workHours.endTime);
  } catch {
    // Use defaults
  }
});
</script>

<template>
  <div class="settings-tab">
    <n-card title="Work Hours" size="small">
      <n-switch
        v-model:value="settings.workHours.enableWorkHours"
      >
        <template #checked>Enabled</template>
        <template #unchecked>Disabled</template>
      </n-switch>

      <div v-if="settings.workHours.enableWorkHours" class="work-hours-config">
        <div class="time-pickers">
          <label>
            Start Time
            <n-time-picker v-model:value="startTimeMs" format="hh:mm a" />
          </label>
          <label>
            End Time
            <n-time-picker v-model:value="endTimeMs" format="hh:mm a" />
          </label>
        </div>

        <n-checkbox-group v-model:value="settings.workHours.days">
          <n-checkbox
            v-for="day in dayOptions"
            :key="day.value"
            :value="day.value"
            :label="day.label"
          />
        </n-checkbox-group>
      </div>
    </n-card>

    <n-card title="Go Back Images" size="small">
      <n-switch v-model:value="settings.allowFunnyGoBackImages">
        <template #checked>Funny images enabled</template>
        <template #unchecked>Funny images disabled</template>
      </n-switch>
    </n-card>

    <n-card title="Lock Settings" size="small">
      <n-radio-group v-model:value="settings.lock.type">
        <n-radio value="none" label="No Lock" />
        <n-radio value="click-button" label="Click Button" />
        <n-radio value="question" label="Answer Question" />
        <n-radio value="password" label="Password" />
      </n-radio-group>

      <div v-if="settings.lock.type === 'password'" class="lock-config">
        <n-input
          v-model:value="settings.lock.password"
          type="password"
          placeholder="Set password"
        />
      </div>

      <div v-if="settings.lock.type === 'question'" class="lock-config">
        <label>
          Number of questions to answer:
          <n-input-number
            v-model:value="settings.lock.questionNumberOfTries"
            :min="1"
            :max="10"
          />
        </label>
      </div>

      <div v-if="settings.lock.type === 'click-button'" class="lock-config">
        <label>
          Number of clicks required:
          <n-input-number
            v-model:value="settings.lock.clickButtonCounts"
            :min="1"
            :max="50"
          />
        </label>
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.settings-tab {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.work-hours-config {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.time-pickers {
  display: flex;
  gap: 16px;
}

.lock-config {
  margin-top: 12px;
}
</style>
```

- [ ] **Step 3: Create `AboutTab.vue`**

Port from `src/options/AboutTab.vue`.

```vue
<script setup lang="ts">
import { NCard } from "naive-ui";
</script>

<template>
  <div class="about-tab">
    <n-card title="About Stay Focused" size="small">
      <p>
        Stay Focused is an open-source Chrome extension designed to help you
        block distracting websites and stay productive.
      </p>
      <p>
        <strong>Author:</strong> Maher Khdeir
      </p>
      <p>
        <a
          href="https://github.com/MaherSaleem/stay-focused-chrome-extension"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Repository
        </a>
      </p>
      <SocialMediaShare />
      <BuyMeACoffee />
    </n-card>
  </div>
</template>

<style scoped>
.about-tab {
  max-width: 600px;
}

p {
  margin-bottom: 8px;
}
</style>
```

Note: `SocialMediaShare` and `BuyMeACoffee` are auto-imported from `components/` by WXT.

- [ ] **Step 4: Commit**

```bash
git add entrypoints/options/components/SettingsTab.vue \
  entrypoints/options/components/AboutTab.vue
git commit -m "feat: port settings and about tabs to Vue 3 + Naive UI"
```

---

## Task 12: Create the options page — main app shell

**Files:**
- Create: `entrypoints/options/index.html`
- Create: `entrypoints/options/main.ts`
- Create: `entrypoints/options/App.vue`
- Create: `entrypoints/options/style.css`

- [ ] **Step 1: Create `entrypoints/options/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="manifest.open_in_tab" content="true" />
    <title>Stay Focused - Options</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

- [ ] **Step 2: Create `entrypoints/options/main.ts`**

```ts
import { createApp } from "vue";
import naive from "naive-ui";
import App from "./App.vue";
import "./style.css";

const app = createApp(App);
app.use(naive);
app.mount("#app");
```

- [ ] **Step 3: Create `entrypoints/options/App.vue`**

```vue
<script setup lang="ts">
import { ref, onMounted, watch, type Component } from "vue";
import {
  NLayout,
  NLayoutSider,
  NMenu,
  NSwitch,
  NSpin,
} from "naive-ui";
import { storage } from "~/utils/storage";
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

const tabComponents: Record<string, Component> = {
  "block-by-website": BlockByWebsiteTab,
  "block-by-word": BlockByWordTab,
  "block-by-regex": BlockByRegexTab,
  settings: SettingsTab,
  about: AboutTab,
};

const menuOptions = [
  { label: "Block By Website", key: "block-by-website" },
  { label: "Block Using a Word", key: "block-by-word" },
  { label: "Block Using Regex", key: "block-by-regex" },
  { label: "Settings", key: "settings" },
  { label: "About", key: "about" },
];

function handleUnlock() {
  isLocked.value = false;
  active.value = false;
}

async function loadData() {
  try {
    active.value = await storage.get<boolean>("active");
  } catch {
    // First run
  }
  try {
    const settings = await storage.get<Settings>("settings");
    const lockType = settings.lock.type;
    isLocked.value =
      lockType !== "none" && (active.value || lockType === "password");
  } catch {
    // First run
  }
}

watch(active, () => {
  storage.set("active", active.value);
});

onMounted(async () => {
  await loadData();
  loading.value = false;
});
</script>

<template>
  <div class="page-container">
    <n-spin v-if="loading" size="large" class="loader" />

    <UnlockPage v-else-if="isLocked" @unlock="handleUnlock" />

    <n-layout v-else has-sider class="main-layout">
      <n-layout-sider
        bordered
        :width="220"
        content-style="padding: 16px;"
      >
        <img
          src="~/assets/images/logo-red.png"
          alt="Stay Focused"
          class="sidebar-logo"
        />
        <n-menu
          v-model:value="selectedTab"
          :options="menuOptions"
        />
      </n-layout-sider>

      <n-layout content-style="padding: 24px;">
        <div class="toolbar">
          <span class="title">Stay Focused</span>
          <n-switch v-model:value="active">
            <template #checked>Active</template>
            <template #unchecked>Inactive</template>
          </n-switch>
        </div>

        <component :is="tabComponents[selectedTab]" @reload-data="loadData" />
      </n-layout>
    </n-layout>
  </div>
</template>

<style scoped>
.page-container {
  height: 100vh;
}

.main-layout {
  height: 100%;
}

.sidebar-logo {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.title {
  font-size: 20px;
  font-weight: 600;
}

.loader {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
```

- [ ] **Step 4: Create `entrypoints/options/style.css`**

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background-color: #f8f9fa;
  height: 100vh;
}

#app {
  height: 100%;
}
```

- [ ] **Step 5: Commit**

```bash
git add entrypoints/options/
git commit -m "feat: port options page shell to Vue 3 + Naive UI with sidebar nav"
```

---

## Task 13: Remove old source files and update .gitignore

**Files:**
- Remove: `src/` (entire directory)
- Modify: `.gitignore`

- [ ] **Step 1: Remove old src directory**

```bash
rm -rf src
```

- [ ] **Step 2: Remove old backup**

```bash
rm -rf old-src-backup
```

- [ ] **Step 3: Update `.gitignore`**

```
node_modules
*.log
.wxt
.output
dist/
dist-zip/
```

- [ ] **Step 4: Remove volta config from package.json if present**

The new project doesn't need volta pinning. Ensure `package.json` doesn't have a `volta` block.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove old Vue 2 / webpack source files, update .gitignore"
```

---

## Task 14: Build, test, and fix issues

- [ ] **Step 1: Run the dev build**

```bash
pnpm dev
```

Expected: WXT starts dev server, outputs to `.output/`, opens Chrome with the extension loaded.

- [ ] **Step 2: Fix any TypeScript errors**

If `pnpm dev` shows errors, fix them one at a time. Common issues:
- Import path typos (use `~/utils/...` for utils, auto-import for `components/` and `composables/`)
- Missing type exports
- Naive UI component imports not matching

- [ ] **Step 3: Fix any runtime errors**

Open Chrome DevTools on the popup, options page, and background service worker. Check for:
- Console errors
- Storage read/write working correctly
- Navigation between tabs working

- [ ] **Step 4: Test each feature manually**

1. Toggle active switch in popup
2. Add a website from popup
3. Open options → verify all 5 tabs render
4. Add a website group, add a site, toggle enable/disable, delete
5. Change settings (work hours, lock type)
6. Test lock mechanisms (set password lock → close options → reopen → unlock gate appears)
7. Visit a blocked site → verify redirect to goback page with random image
8. Verify goback images load (they should be at `/goback/images/...`)

- [ ] **Step 5: Run production build**

```bash
pnpm build
```

Expected: clean build with no errors, output in `.output/chrome-mv3/`.

- [ ] **Step 6: Run zip**

```bash
pnpm zip
```

Expected: creates a zip file in `.output/` ready for Chrome Web Store upload.

- [ ] **Step 7: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build and runtime issues from modernization port"
```

---

## Task 15: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Rewrite `CLAUDE.md` to reflect the new stack**

Update the commands, architecture, and tooling sections to reflect WXT + Vue 3 + TypeScript + Naive UI + pnpm. Remove all references to webpack, Vue 2, Vue Material, node-sass, babel, npm.

Key sections to update:
- Commands: `pnpm dev`, `pnpm build`, `pnpm zip`
- Architecture: WXT entry points, Vue 3 Composition API, Naive UI components
- Storage model: same (no change needed)
- Vue stack: Vue 3 + Naive UI replaces Vue 2 + Vue Material

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for WXT + Vue 3 + TypeScript + Naive UI stack"
```
