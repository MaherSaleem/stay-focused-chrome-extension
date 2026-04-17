# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Stay Focused is a Chrome extension (Manifest V3) built with Vue 2 + Vue Material that blocks distracting websites. It ships to the Chrome Web Store; there are no tests.

## Commands

```bash
npm install             # install deps (Node >=10; volta pins node 14.21.3)
npm run watch:dev       # dev build + HMR via webpack-extension-reloader (load dist/ unpacked in chrome://extensions)
npm run build:dev       # one-off dev build
npm run build           # production build
npm run build-zip       # package dist/ into dist-zip/stay-focused-v<version>.zip (run after build)
npm run prettier:write  # format src/**/*.{js,vue}
```

Dev builds prefix the extension name with `DEV - ` and relax CSP; see [webpack.config.js](webpack.config.js#L92-L99).

## Architecture

Webpack has four independent entry points, each emitted as a separate bundle ([webpack.config.js:12-21](webpack.config.js#L12-L21)):

- **`background.js`** — MV3 service worker. Listens on `chrome.webNavigation.onCommitted` and, if the extension is active (and within configured work hours), checks the URL against the user's block list and redirects the tab to `goback/goback.html`. Also sets the toolbar icon color and runs the install/upgrade handler.
- **`popup/`** — toolbar popup (Vue app). Toggles active state and quick-adds the current tab's hostname to a special `added-from-popup-uid` group.
- **`options/`** — full-page options UI (Vue app). Four tabs drive block-list editing (website/word/regex) plus settings (work hours, lock type). Settings changes are read/written against `chrome.storage.local`.
- **`goback/`** — the redirect target page that shows a random "go back to work" image.

### Storage model

Everything persists in `chrome.storage.local` under three keys, wrapped by the promise API in [src/chromeApiHelpers.js](src/chromeApiHelpers.js):

- `active` (boolean) — master on/off.
- `sitesGroups` — array of groups. Each group has a `blockType` (`"website" | "word" | "regex"`) that applies to every site in it; a site is blocked only when both `groupEnabled` and `enabled` are true. Use the `getSiteGroupStructure` / `getSiteStructure` factories in [src/dataHelpers/SitesGroup.js](src/dataHelpers/SitesGroup.js) rather than building these objects by hand.
- `settings` — `workHours`, `allowFunnyGoBackImages`, and `lock` (types: `none | password | question | click-button`).

Important: `localStorage.get` rejects (not resolves to `undefined`) when a key is missing — see [src/chromeApiHelpers.js:12](src/chromeApiHelpers.js#L12). Components rely on this to detect first-run and seed defaults from [src/defaults.js](src/defaults.js).

### Block matching

[src/background.js:21-31](src/background.js#L21-L31) — `regex` groups go through `RegExp.test`; all other types use `url.includes`. URLs in [src/constants.js](src/constants.js) `skippedUrls` are always allowed (used to whitelist share URLs so the extension doesn't break its own social share buttons).

### Version migrations

When the extension updates, [src/Migration/upgrades.js](src/Migration/upgrades.js) runs via `chrome.runtime.onInstalled` with `reason === "update"`. Schema-changing releases add a new handler here and guard it with `versionCompare` from [src/helpers.js:120](src/helpers.js#L120). The manifest's version is overwritten at build time from `package.json` ([webpack.config.js:88-91](webpack.config.js#L88-L91)), so bump `package.json` — not `src/manifest.json` — when releasing.

### Vue stack

Vue 2.6 + Vue Material. Shared UI primitives live in [src/sharedComponents/](src/sharedComponents/). Options-page tabs under [src/options/BlockItemTabs/](src/options/BlockItemTabs/) all extend `BlockItemBaseTab.vue`, which centralizes load/store/add/delete logic against `sitesGroups`; new block-type tabs should compose it rather than duplicate the CRUD code.
