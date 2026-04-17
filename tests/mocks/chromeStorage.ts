import { vi } from "vitest";

/**
 * In-memory mock of chrome.storage.local that mirrors our chromeStorage API.
 * Tests can inspect `mockStore` to verify what was saved.
 */
export const mockStore: Record<string, unknown> = {};

export function resetMockStore(initial: Record<string, unknown> = {}) {
  Object.keys(mockStore).forEach((k) => delete mockStore[k]);
  Object.assign(mockStore, initial);
}

// Mock chrome.storage.local globally
const chromeStorageLocal = {
  get: vi.fn((key: string, cb: (data: Record<string, unknown>) => void) => {
    if (mockStore[key] !== undefined) {
      cb({ [key]: JSON.parse(JSON.stringify(mockStore[key])) });
    } else {
      cb({});
    }
  }),
  set: vi.fn((data: Record<string, unknown>, cb?: () => void) => {
    Object.entries(data).forEach(([k, v]) => {
      mockStore[k] = JSON.parse(JSON.stringify(v));
    });
    cb?.();
  }),
};

// Install on globalThis so chrome.storage.local works
(globalThis as any).chrome = {
  storage: { local: chromeStorageLocal },
  action: { setIcon: vi.fn() },
  tabs: { query: vi.fn(), create: vi.fn() },
};
