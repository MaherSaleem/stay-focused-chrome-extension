# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Stay Focused is a Chrome extension (Manifest V3) built with WXT + Vue 3 + TypeScript + Naive UI that blocks distracting websites. It ships to the Chrome Web Store.

## Commands

```bash
pnpm install            # install deps
pnpm dev                # dev build + HMR (WXT loads extension in Chrome automatically)
pnpm build              # production build (output in .output/chrome-mv3/)
pnpm zip                # production build + zip for Chrome Web Store upload
pnpm test               # run vitest tests once
pnpm test:watch         # run vitest in watch mode
pnpm format             # format code with prettier
pnpm format:check       # check formatting without writing
```

## Architecture

WXT discovers entry points from the `entrypoints/` directory and generates the manifest automatically from [wxt.config.ts](wxt.config.ts).

- **`entrypoints/background.ts`** — MV3 service worker. Listens on `chrome.webNavigation.onCommitted` and, if the extension is active (and within configured work hours), checks the URL against the user's block list and redirects the tab to `/goback.html`. Also sets the toolbar icon color and runs the install/upgrade handler.
- **`entrypoints/popup/`** — toolbar popup (Vue 3 app). Toggles active state and quick-adds the current tab's hostname to a special `added-from-popup-uid` group.
- **`entrypoints/options/`** — full-page options UI (Vue 3 app). Five tabs: block-by-website, block-by-word, block-by-regex, settings, about. Uses Naive UI components (`n-layout`, `n-menu`, `n-switch`, `n-card`, etc.). Settings changes are read/written against `chrome.storage.local`.
- **`entrypoints/goback/`** — unlisted page (redirect target) that shows a random "go back to work" image. WXT flattens this to `/goback.html` in the build output.

### Shared code

- **`utils/`** — TypeScript utility modules (auto-imported by WXT): `types.ts` (interfaces), `storage.ts` (`chromeStorage` wrapper), `helpers.ts`, `defaults.ts`, `constants.ts`, `migration.ts`.
- **`components/`** — shared Vue 3 SFCs (auto-imported): `CardWithLogo.vue`, `BuyMeACoffee.vue`, `SocialMediaShare.vue`.

### Storage model

Everything persists in `chrome.storage.local` under three keys, wrapped by the typed promise API in [utils/storage.ts](utils/storage.ts):

- `active` (boolean) — master on/off.
- `sitesGroups` — array of `SiteGroup` objects (see [utils/types.ts](utils/types.ts)). Each group has a `blockType` (`"website" | "word" | "regex"`); a site is blocked only when both `groupEnabled` and `enabled` are true. Use the `makeSiteGroup` / `makeSite` factories in [utils/defaults.ts](utils/defaults.ts).
- `settings` — `workHours`, `allowFunnyGoBackImages`, and `lock` (types: `none | password | question | click-button`).

Important: `chromeStorage.get()` rejects (not resolves to `undefined`) when a key is missing. Components rely on this to detect first-run and seed defaults from [utils/defaults.ts](utils/defaults.ts).

`chromeStorage.set()` deep-clones values via `JSON.parse(JSON.stringify(value))` before writing — this strips Vue 3 reactive Proxy wrappers, which `chrome.storage.local.set()` cannot serialize.

### Block matching

[entrypoints/background.ts](entrypoints/background.ts) — `regex` groups go through `RegExp.test` (errors return `false` so one bad pattern doesn't abort the whole list); all other types use `url.includes`. URLs in [utils/constants.ts](utils/constants.ts) `skippedUrls` are always allowed (whitelists share URLs so the extension doesn't block its own social share buttons).

### Version migrations

When the extension updates, [utils/migration.ts](utils/migration.ts) runs via `chrome.runtime.onInstalled` with `reason === "update"`. Schema-changing releases add a new handler here and guard it with `versionCompare` from [utils/helpers.ts](utils/helpers.ts). WXT injects the version from `package.json` into the manifest at build time, so bump `package.json` when releasing.

### Vue stack

Vue 3 with Composition API (`<script setup lang="ts">`). Naive UI provides the component library (switches, cards, inputs, layout, time picker, etc.). Options-page tabs under [entrypoints/options/components/](entrypoints/options/components/) all compose `BlockItemBaseTab.vue`, which centralizes load/store/add/delete logic against `sitesGroups`; new block-type tabs should compose it rather than duplicate the CRUD code.

Naive UI components that use `useMessage()` or `useDialog()` (e.g., `PasswordUnlock.vue`, `SettingsTab.vue`'s reset dialog) require `<n-message-provider>` and `<n-dialog-provider>` wrappers — both are set up in [entrypoints/options/App.vue](entrypoints/options/App.vue).

Shared components in `components/` are auto-imported by WXT in top-level entrypoints, but **sub-components like those in `entrypoints/options/components/` must explicitly import them** (auto-import doesn't resolve across sub-entries).

## Tests

Vitest + Vue Test Utils + happy-dom. Tests live in `tests/`:

- `tests/helpers.test.ts` — pure utility functions (URL validation, time checks, regex, version compare)
- `tests/defaults.test.ts` — factory functions and default data
- `tests/migration.test.ts` — version upgrade handlers
- `tests/block-list-crud.test.ts` — UI integration tests that mount `BlockItemBaseTab.vue` and verify add/delete/toggle operations produce correct JSON
- `tests/storage-persistence.test.ts` — verifies every CRUD op writes correct shape to `chrome.storage.local`
- `tests/mocks/chromeStorage.ts` — in-memory mock of `chrome.storage.local` that installs `globalThis.chrome`

## CI/CD

- **`.github/workflows/ci.yml`** — runs on every PR and push to master. Steps: install → test → format check → build. Required to pass via branch ruleset before merging to master.
- **`.github/workflows/release.yml`** — runs on push to master. Checks if a tag for the current `package.json` version already exists; if not, runs tests, builds the zip, and creates a GitHub Release tagged `v<version>` with the zip attached. Bump `package.json` version to trigger a new release.

Prettier config is at [.prettierrc](.prettierrc). Code style: 2-space indent, 100-char width, double quotes, trailing commas.
