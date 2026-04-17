# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Stay Focused is a Chrome extension (Manifest V3) built with WXT + Vue 3 + TypeScript + Naive UI that blocks distracting websites. It ships to the Chrome Web Store; there are no tests.

## Commands

```bash
pnpm install            # install deps
pnpm dev                # dev build + HMR (WXT loads extension in Chrome automatically)
pnpm build              # production build (output in .output/chrome-mv3/)
pnpm zip                # production build + zip for Chrome Web Store upload
pnpm format             # format code with prettier
pnpm format:check       # check formatting without writing
```

## Architecture

WXT discovers entry points from the `entrypoints/` directory and generates the manifest automatically from [wxt.config.ts](wxt.config.ts).

- **`entrypoints/background.ts`** — MV3 service worker. Listens on `chrome.webNavigation.onCommitted` and, if the extension is active (and within configured work hours), checks the URL against the user's block list and redirects the tab to `/goback/index.html`. Also sets the toolbar icon color and runs the install/upgrade handler.
- **`entrypoints/popup/`** — toolbar popup (Vue 3 app). Toggles active state and quick-adds the current tab's hostname to a special `added-from-popup-uid` group.
- **`entrypoints/options/`** — full-page options UI (Vue 3 app). Five tabs: block-by-website, block-by-word, block-by-regex, settings, about. Uses Naive UI components (`n-layout`, `n-menu`, `n-switch`, `n-card`, etc.). Settings changes are read/written against `chrome.storage.local`.
- **`entrypoints/goback/`** — unlisted page (redirect target) that shows a random "go back to work" image.

### Shared code

- **`utils/`** — TypeScript utility modules (auto-imported by WXT): `types.ts` (interfaces), `storage.ts` (`chromeStorage` wrapper), `helpers.ts`, `defaults.ts`, `constants.ts`, `migration.ts`.
- **`composables/`** — Vue 3 composables (auto-imported): `useStorage.ts` provides a reactive `ref` backed by `chrome.storage.local`.
- **`components/`** — shared Vue 3 SFCs (auto-imported): `CardWithLogo.vue`, `BuyMeACoffee.vue`, `SocialMediaShare.vue`.

### Storage model

Everything persists in `chrome.storage.local` under three keys, wrapped by the typed promise API in [utils/storage.ts](utils/storage.ts):

- `active` (boolean) — master on/off.
- `sitesGroups` — array of `SiteGroup` objects (see [utils/types.ts](utils/types.ts)). Each group has a `blockType` (`"website" | "word" | "regex"`); a site is blocked only when both `groupEnabled` and `enabled` are true. Use the `makeSiteGroup` / `makeSite` factories in [utils/defaults.ts](utils/defaults.ts).
- `settings` — `workHours`, `allowFunnyGoBackImages`, and `lock` (types: `none | password | question | click-button`).

Important: `chromeStorage.get()` rejects (not resolves to `undefined`) when a key is missing. Components rely on this to detect first-run and seed defaults from [utils/defaults.ts](utils/defaults.ts).

### Block matching

[entrypoints/background.ts](entrypoints/background.ts) — `regex` groups go through `RegExp.test`; all other types use `url.includes`. URLs in [utils/constants.ts](utils/constants.ts) `skippedUrls` are always allowed (whitelists share URLs so the extension doesn't block its own social share buttons).

### Version migrations

When the extension updates, [utils/migration.ts](utils/migration.ts) runs via `chrome.runtime.onInstalled` with `reason === "update"`. Schema-changing releases add a new handler here and guard it with `versionCompare` from [utils/helpers.ts](utils/helpers.ts). WXT injects the version from `package.json` into the manifest at build time, so bump `package.json` when releasing.

### Vue stack

Vue 3 with Composition API (`<script setup lang="ts">`). Naive UI provides the component library (switches, cards, inputs, layout, time picker, etc.). Options-page tabs under [entrypoints/options/components/](entrypoints/options/components/) all compose `BlockItemBaseTab.vue`, which centralizes load/store/add/delete logic against `sitesGroups`; new block-type tabs should compose it rather than duplicate the CRUD code.
