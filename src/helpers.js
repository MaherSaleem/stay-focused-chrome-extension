import * as defaults from "./defaults";

export const resetChromeStorageData = () => {
    chrome.storage.local.set({"sitesGroups": defaults.websitesListDefault});
    chrome.storage.local.set({"settings": defaults.settingsDefault});
    chrome.storage.local.set({"active": defaults.activeDefault});
}

/**
 *
 * @param url {string} // format "08:15 AM"
 * @returns {url}
 */
export const getHostNameFromStringUrl = url => {
    var a = document.createElement("a");
    a.href = url;
    let hostName = a.hostname;
    if (hostName.startsWith("www.")) {
        hostName = hostName.substr(4);
    }
    return hostName;
}


