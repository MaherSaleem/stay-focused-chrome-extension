export const localStorage = {
    /**
     * Get value from local storage
     * @param key {string}
     * @returns {Promise}
     */
    async get(key) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(key, data => {
                if (data[key] !== undefined) {
                    resolve(data[key]);
                } else {
                    reject("");
                }
            });
        });
    },
    /**
     * Set value in local storage
     * @param key {string}
     * @param value {any}
     */
    async set(key, value) {
        chrome.storage.local.set({[key]: value});
    }
};

/**
 * Get the currently active tab
 * @returns {Promise}
 */
export const getChromeActiveTab = async () => {
    return new Promise((resolve) => {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            resolve(tabs[0]);
        });
    });
};

/**
 * Open a new tab with a specific URL
 * @param url {string}
 */
export const openChromeNewTab = (url) => {
    chrome.tabs.create({"url": url});
};

/**
 * Set the extension icon
 * @param iconPath {string}
 */
export const setExtensionIcon = (iconPath) => {
    chrome.action.setIcon({"path": iconPath});
};
