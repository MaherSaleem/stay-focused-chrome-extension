
import * as defaults from "./defaults";

export const resetChromeStorageData = () => {
    chrome.storage.local.set({"sitesGroups": defaults.websitesListDefault});
    chrome.storage.local.set({"settings": defaults.settingsDefault});
    chrome.storage.local.set({"active": defaults.activeDefault});
}


