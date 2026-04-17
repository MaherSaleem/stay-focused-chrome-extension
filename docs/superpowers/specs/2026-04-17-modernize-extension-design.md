# Stay Focused Extension — Modernization Design

## Goal

Port the extension from its 2019 stack (Vue 2, webpack 4, Vue Material, node-sass) to a 2026 stack while preserving all features and existing user data.

## Stack

| Layer | Current | New |
|---|---|---|
| Extension framework | Webpack 4 + manual manifest | **WXT** (Vite-based) |
| Language | JavaScript (ES2017) | **TypeScript** |
| UI framework | Vue 2.6 + Vue Material beta-13 | **Vue 3** (Composition API + `<script setup>`) |
| Component library | Vue Material beta-13 | **Naive UI** |
| Styling | SCSS via node-sass | **Plain CSS** (modern features: nesting, custom properties, `:has()`) for custom styles; Naive UI handles component styling |
| Time picker | vue2-timepicker | **Naive UI `n-time-picker`** |
| Share buttons | vue-share-buttons | Plain `<a>` tags |
| Polyfill | webextension-polyfill 0.3 | None (WXT + MV3 native) |
| Package manager | npm 6 | **pnpm** |

## Deleted dependencies

Everything in the current `package.json` is replaced or dropped:

- **Runtime:** vue (2.x), vue-material, vue-share-buttons, vue2-timepicker, webextension-polyfill
- **Dev:** @babel/*, babel-loader, copy-webpack-plugin, core-js, cross-env, css-loader, ejs, file-loader, mini-css-extract-plugin, node-sass, sass-loader, vue-loader, vue-template-compiler, web-ext-types, webpack, webpack-cli, webpack-extension-reloader, archiver

## New dependencies

- **Runtime:** vue (3.x), naive-ui
- **Dev:** wxt, typescript, @anthropic-ai/wxt-vue (WXT Vue integration)

WXT brings its own Vite-based build pipeline. No babel, no webpack plugins, no CSS loaders needed.

## Features preserved (no changes)

1. Block websites by website name, word, or regex
2. Site groups with per-group and per-site enable/disable
3. Work hours (day-of-week + start/end time)
4. Lock mechanisms: none, password, question, click-button
5. Popup: toggle active, quick-add current site
6. Goback page: random motivational images
7. Toolbar icon color reflects active state
8. Version migration on extension update
9. Social share / buy-me-a-coffee links

## Storage schema (unchanged)

Existing users' data must survive the update. The three `chrome.storage.local` keys stay identical:

```ts
// chrome.storage.local keys
{
  active: boolean;
  sitesGroups: SiteGroup[];
  settings: Settings;
}

interface SiteGroup {
  groupName: string;
  sitesList: Site[];
  uid: string;
  groupEnabled: boolean;
  blockType: "website" | "word" | "regex";
}

interface Site {
  url: string;
  enabled: boolean;
}

interface Settings {
  workHours: {
    startTime: string;   // "08:00 AM"
    endTime: string;     // "05:00 PM"
    days: string[];      // ["1","2","3","4","5"]
    enableWorkHours: boolean;
  };
  allowFunnyGoBackImages: boolean;
  lock: {
    type: "none" | "password" | "question" | "click-button";
    password: string;
    questionNumberOfTries: number;
    clickButtonCounts: number;
  };
}
```

## WXT + Vue 3 project structure

```
stay-focused-chrome-extension/
├── wxt.config.ts                  # WXT config (replaces webpack.config.js)
├── package.json
├── tsconfig.json
├── assets/
│   ├── icons/                     # extension icons (same files)
│   └── images/                    # logo images
├── entrypoints/
│   ├── background.ts              # service worker (no Vue — pure TS)
│   ├── popup/
│   │   ├── index.html
│   │   ├── main.ts                # Vue 3 createApp
│   │   ├── App.vue
│   │   └── style.css
│   ├── options/
│   │   ├── index.html
│   │   ├── main.ts                # Vue 3 createApp + Naive UI plugin
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
│       ├── main.ts                # Vue 3 createApp
│       ├── App.vue
│       └── style.css
├── components/                    # shared components (auto-imported by WXT)
│   ├── CardWithLogo.vue
│   ├── BuyMeACoffee.vue
│   └── SocialMediaShare.vue
├── composables/                   # Vue 3 composables (shared reactive logic)
│   └── useStorage.ts              # reactive wrapper around chrome.storage.local
├── lib/
│   ├── storage.ts                 # chrome.storage.local promise helpers (typed)
│   ├── types.ts                   # SiteGroup, Site, Settings interfaces
│   ├── defaults.ts                # default data (same values)
│   ├── constants.ts               # skippedUrls, blockTypes
│   ├── helpers.ts                 # URL validation, time checks, etc.
│   └── migration.ts               # version upgrade handlers
└── public/
    └── goback/images/             # motivational images served as static files
```

## Entry point mapping

### background.ts (service worker)

Direct port of current `src/background.js`. Same logic:
- `chrome.webNavigation.onCommitted` → check active, work hours, match URL, redirect to goback
- `chrome.runtime.onInstalled` → seed defaults on install, run migrations on update
- Icon color based on active state

Pure TypeScript — no Vue needed in the service worker.

### popup/ (toolbar popup)

Vue 3 SFC replaces `src/popup/App.vue`. Uses Naive UI components:
- Header with logo + settings gear link
- `n-switch` for active state toggle
- Current website display + `n-button` "Add Website"
- Buy-me-a-coffee component

### options/ (full-page options)

Vue 3 SFCs replace `src/options/App.vue` + all sub-components. This is the largest page:
- `n-layout` + `n-layout-sider` for sidebar + content area
- `n-menu` for sidebar navigation (replaces manual tab switching)
- Block tabs: each tab is a Vue 3 SFC composing `BlockItemBaseTab.vue` (same pattern as current codebase)
- `BlockItemBaseTab.vue` uses Composition API: `useStorage` composable for reactive CRUD against `sitesGroups`
- Settings tab: `n-checkbox-group` for days, `n-time-picker` for work hours, `n-radio-group` for lock type
- Unlock gate: same logic — if locked and active, show unlock component

### goback/ (redirect page)

Vue 3 SFC replaces `src/goback/App.vue`. Pick random image, display with caption. Smallest page.

## Vue 2 → Vue 3 migration patterns

| Vue 2 pattern | Vue 3 replacement |
|---|---|
| Options API (`data`, `methods`, `computed`, `watch`) | Composition API (`ref`, `computed`, `watch`) in `<script setup>` |
| `this.property` | `const property = ref(value)` |
| `mounted()` | `onMounted()` |
| `v-model` on components | Same (Vue 3 uses `modelValue` prop under the hood) |
| Event bus / `$emit` | `defineEmits` + `emit()` |
| `props` declaration | `defineProps<{ ... }>()` with TypeScript generics |

## UI component replacements

| Vue Material component | Naive UI replacement |
|---|---|
| `md-switch` | `n-switch` |
| `md-button` | `n-button` |
| `md-field` + `md-input` | `n-input` |
| `md-list` + `md-list-item` | `n-list` + `n-list-item` or `n-menu` |
| `md-icon` | `n-icon` with inline SVG |
| `md-card` | `n-card` |
| `md-app` + `md-app-drawer` | `n-layout` + `n-layout-sider` |
| `md-progress-spinner` | `n-spin` |
| `md-badge` | `n-badge` or `n-tag` |
| `vue2-timepicker` | `n-time-picker` |

## Migration path for existing users

The `chrome.runtime.onInstalled` handler with `reason === "update"` continues to work. The existing `handle103To104Upgrade` is ported. No new storage migration is needed since the schema is unchanged.

The manifest version in `package.json` should be bumped (e.g., to `1.1.0`) to reflect the rebuild.

## What's NOT changing

- Chrome Web Store listing (same extension ID, same permissions)
- The set of permissions (`storage`, `webNavigation`, `tabs`, `host_permissions`)
- User-facing behavior (same features, same flows). Visual appearance will use Naive UI's design language instead of Material Design — clean and modern, but not pixel-identical.
- The goback images
- Storage schema and existing user data

## Open decisions (resolved)

- **UI framework:** Vue 3 with Composition API — confirmed by user
- **Component library:** Naive UI — recommended, confirmed
- **CSS approach:** Plain CSS for custom styles, Naive UI for component styling — confirmed
- **Share buttons:** Port as plain `<a>` tags (low effort, keep the feature)
