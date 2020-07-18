import {
    getFlatEnabledListOfWebsites,
    isCurrentTimeBetweenTwoTimes,
    isTodayOneOfTheseDays,
    isValidURL, regexMatch,
    resetChromeStorageData as setDefaultStorageData,
    setIcon
} from "./helpers";

global.browser = require('webextension-polyfill');
import {localStorage} from "./chromeApiHelpers";
import {handle103To104Upgrade} from "./Migration/upgrades";
import {skippedUrls} from "./constants";

const chooseIconColor = () => {
    localStorage.get("active").then(active => {
        setIcon(active);
    });
}
const checkIfMatch = (blockItem, url) => {
    if (skippedUrls.some(skippedUrl => url.includes(skippedUrl))) {
        return false;
    }
    switch (blockItem.blockType) {
        case "regex":
            return regexMatch(url, blockItem.url);
        default:
            return url.includes(blockItem.url)
    }
}
const checkIfCanEnterWebsite = info => {
    if (info.frameId === 0 && isValidURL(info.url)) {
        localStorage.get("active").then(isActive => {
            if (isActive) {
                localStorage.get("settings").then(settings => {
                    if (settings.workHours && settings.workHours.enableWorkHours === true) {
                        isActive = isActive && isTodayOneOfTheseDays(settings.workHours.days) && isCurrentTimeBetweenTwoTimes(settings.workHours.startTime, settings.workHours.endTime);
                    }
                    if (isActive) {
                        localStorage.get("sitesGroups").then(sitesGroups => {
                            let blockedWebsites = getFlatEnabledListOfWebsites(sitesGroups);
                            let mustGoBack = blockedWebsites.some(website => checkIfMatch(website, info.url));
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


//handle installation of extension
chrome.runtime.onInstalled.addListener((details) => {
    const currentVersion = chrome.runtime.getManifest().version
    const previousVersion = details.previousVersion;
    localStorage.set('version', currentVersion);
    const reason = details.reason;
    switch (reason) {
        case 'install':
            setDefaultStorageData();
            console.log("installed Successfully");
            break;
        case 'update':
            console.log(`prev version: ${previousVersion}, current version: ${currentVersion}`);
            handle103To104Upgrade(previousVersion, currentVersion);
            console.log("Updated Successfully");
            break;
    }
})