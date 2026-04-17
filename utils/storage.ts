export const chromeStorage = {
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
