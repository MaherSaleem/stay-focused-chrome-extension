global.browser = require('webextension-polyfill');
import store from './store'

// alert(`Hello ${store.getters.foo}!`);

const checkIfCanEnterWebsite = info => {
    chrome.storage.local.get("active", activeItem => {
        if (activeItem.active) {
            chrome.storage.local.get("flatEnabledSites", item => {
                let blockedWebsites = item.flatEnabledSites;
                var mustGoBack = blockedWebsites.some(website => info.url.includes(website.url));
                if (info.frameId === 0 && mustGoBack) {
                    chrome.tabs.update(info.tabId, {"url": "GoBack.html"});
                }
            });
        }
    });
};

chrome.webNavigation.onCommitted.addListener(checkIfCanEnterWebsite);
