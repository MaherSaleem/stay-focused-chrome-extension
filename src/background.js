global.browser = require('webextension-polyfill');
import store from './store'

// alert(`Hello ${store.getters.foo}!`);


/**
 *
 * @param link {string}
 * @returns {string}
 */
const normalizeLink = link => {
    return link;// TODO implement that
}


const checkIfCanEnterWebsite = info => {
    chrome.storage.local.get("active", activeItem => {
        if (activeItem.active) {
            chrome.storage.local.get("flatEnabledSites", item => {
                let blockedWebsites = item.flatEnabledSites;
                var mustGoBack = blockedWebsites.some(website => normalizeLink(info.url).includes(normalizeLink(website.url)));
                if (info.frameId === 0 && mustGoBack) {
                    chrome.tabs.update(info.tabId, {"url": "goback/goback.html"});
                }
            });
        }
    });
};

chrome.webNavigation.onCommitted.addListener(checkIfCanEnterWebsite);
