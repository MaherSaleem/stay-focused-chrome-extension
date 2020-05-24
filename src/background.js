import {isCurrentTimeBetweenTwoTimes, isValidURL, setIcon} from "./helpers";

global.browser = require('webextension-polyfill');
import {localStorage} from "./chromeApiHelpers";

const chooseIconColor = () => {
    localStorage.get("active").then(active => {
        setIcon(active);
    });
}

const checkIfCanEnterWebsite = info => {
    if (info.frameId === 0 && isValidURL(info.url)) {
        localStorage.get("active").then(isActive => {
            if (isActive) {
                localStorage.get("settings").then(settings => {
                    if (settings.workHours && settings.workHours.enableWorkHours === true) {
                        isActive = isActive && isCurrentTimeBetweenTwoTimes(settings.workHours.startTime, settings.workHours.endTime);
                    }
                    if (isActive) {
                        localStorage.get("flatEnabledSites").then(blockedWebsites => {
                            let mustGoBack = blockedWebsites.some(website => info.url.includes(website.url));
                            if (mustGoBack) {
                                chrome.tabs.update(info.tabId, {"url": "goback/goback.html"});
                            }
                        })
                    }
                })
            }
        })
    }
};

chrome.webNavigation.onCommitted.addListener(checkIfCanEnterWebsite);
chrome.webNavigation.onCommitted.addListener(chooseIconColor);
