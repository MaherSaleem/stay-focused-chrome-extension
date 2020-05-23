import {isCurrentTimeBetweenTwoTimes, isValidURL} from "./helpers";

global.browser = require('webextension-polyfill');
import store from './store'
import {getChromeLocalStorage} from "./chromeApiHelpers";


const checkIfCanEnterWebsite = info => {
    if (info.frameId === 0 && isValidURL(info.url)) {
        getChromeLocalStorage("active").then(isActive => {
            if (isActive) {
                getChromeLocalStorage("settings").then(settings => {
                    if (settings.workHours && settings.workHours.enableWorkHours === true) {
                        isActive = isActive && isCurrentTimeBetweenTwoTimes(settings.workHours.startTime, settings.workHours.endTime);
                    }
                    if (isActive) {
                        getChromeLocalStorage("flatEnabledSites").then(blockedWebsites => {
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
