import {
  getFlatEnabledListOfWebsites,
  isCurrentTimeBetweenTwoTimes,
  isTodayOneOfTheseDays,
  isValidURL,
  regexMatch,
  resetChromeStorageData as setDefaultStorageData,
  setIcon
} from "./helpers";
import { localStorage } from "./chromeApiHelpers";
import { handle103To104Upgrade } from "./Migration/upgrades";
import { skippedUrls } from "./constants";

// Define the function to choose the icon color
const chooseIconColor = async () => {
  const active = await localStorage.get("active");
  setIcon(active);
};

// Define the function to check if the URL matches blocked sites
const checkIfMatch = (blockItem, url) => {
  if (skippedUrls.some(skippedUrl => url.includes(skippedUrl))) {
    return false;
  }
  switch (blockItem.blockType) {
    case "regex":
      return regexMatch(url, blockItem.url);
    default:
      return url.includes(blockItem.url);
  }
};

// Define the function to check if access to a website is allowed
const checkIfCanEnterWebsite = async info => {
  // Check if it's the main frame and URL is valid
  if (info.frameId !== 0 || !isValidURL(info.url)) {
    return;
  }

  // Check if the extension is active
  let isExtensionActive = await localStorage.get("active");
  if (!isExtensionActive) {
    return;
  }

  // Get settings from local storage
  const settings = await localStorage.get("settings");

  // Check if work hours are enabled and if the current day and time match
  if (settings.workHours?.enableWorkHours) {
    const isWorkDay = isTodayOneOfTheseDays(settings.workHours.days);
    const isWithinWorkTime = isCurrentTimeBetweenTwoTimes(
      settings.workHours.startTime,
      settings.workHours.endTime
    );

    if (!(isWorkDay && isWithinWorkTime)) {
      return;
    }
  }

  // Get blocked websites list and check if the current URL is in it
  const sitesGroups = await localStorage.get("sitesGroups");
  const blockedWebsites = getFlatEnabledListOfWebsites(sitesGroups);

  const isBlocked = blockedWebsites.some(website =>
    checkIfMatch(website, info.url)
  );
  if (isBlocked) {
    await chrome.tabs.update(info.tabId, { url: "goback/goback.html" });
  }
};

// Add listeners
chrome.webNavigation.onCommitted.addListener(checkIfCanEnterWebsite);
chrome.webNavigation.onCommitted.addListener(chooseIconColor);

// Handle extension installation and update
chrome.runtime.onInstalled.addListener(async details => {
  const currentVersion = chrome.runtime.getManifest().version;
  const previousVersion = details.previousVersion;
  await localStorage.set("version", currentVersion);
  const reason = details.reason;
  switch (reason) {
    case "install":
      setDefaultStorageData();
      console.log("Installed Successfully");
      break;
    case "update":
      console.log(
        `prev version: ${previousVersion}, current version: ${currentVersion}`
      );
      handle103To104Upgrade(previousVersion, currentVersion);
      console.log("Updated Successfully");
      break;
  }
});
