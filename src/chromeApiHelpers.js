import * as defaults from "./defaults";

/**
 *
 * @param key {string}
 * @returns {Promise}
 */
export const getChromeLocalStorage = key => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, data => {
            if (data[key] !== undefined) {
                resolve(data[key]);
            } else {
                reject("");
            }
        });
    });
}

/**
 *
 * @param key {string}
 * @param value {any}
 */
export const setChromeLocalStorage = (key, value) => {
    chrome.storage.local.set({[key]: value});
}


/**
 *
 * @returns {Promise}
 */
export const getChromeActiveTab = () => {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            resolve(tabs[0])
        });
    });
}

/**
 *
 * @param url {string}
 */
export const openChromeNewTab = url => {
    chrome.tabs.create({"url": url});
}

