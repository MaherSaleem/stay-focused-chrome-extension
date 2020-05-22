import {isCurrentTimeBetweenTwoTimes, isValidURL} from "./helpers";

global.browser = require('webextension-polyfill');
import store from './store'





const checkIfCanEnterWebsite = info => {
    if (info.frameId === 0 && isValidURL(info.url)) {
        chrome.storage.local.get("active", activeItem => {
            let isActive = activeItem.active;
            if (isActive) {
                chrome.storage.local.get("settings", settingsItem => {
                    let settings = settingsItem.settings;
                    if (settings.workHours && settings.workHours.enableWorkHours === true) {
                        isActive = isActive && isCurrentTimeBetweenTwoTimes(settings.workHours.startTime, settings.workHours.endTime);
                    }
                    if (isActive) {
                        chrome.storage.local.get("flatEnabledSites", item => {
                            let blockedWebsites = item.flatEnabledSites;
                            let mustGoBack = blockedWebsites.some(website => info.url.includes(website.url));
                            if (mustGoBack) {
                                chrome.tabs.update(info.tabId, {"url": "goback/goback.html"});
                            }
                        });
                    }
                });
            }
        });
    }
};

chrome.webNavigation.onCommitted.addListener(checkIfCanEnterWebsite);
