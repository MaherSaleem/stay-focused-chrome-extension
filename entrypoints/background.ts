import { storage } from "~/utils/storage";
import { skippedUrls } from "~/utils/constants";
import {
  getFlatEnabledListOfWebsites,
  isCurrentTimeBetweenTwoTimes,
  isTodayOneOfTheseDays,
  isValidURL,
  regexMatch,
  setIcon,
} from "~/utils/helpers";
import {
  settingsDefault,
  websitesListDefault,
  activeDefault,
} from "~/utils/defaults";
import { handle103To104Upgrade } from "~/utils/migration";
import type { Settings, SiteGroup } from "~/utils/types";

export default defineBackground({
  main() {
    const chooseIconColor = async () => {
      try {
        const active = await storage.get<boolean>("active");
        setIcon(active);
      } catch {
        setIcon(false);
      }
    };

    const checkIfMatch = (
      blockItem: { blockType: string; url: string },
      url: string,
    ): boolean => {
      if (skippedUrls.some((skippedUrl) => url.includes(skippedUrl))) {
        return false;
      }
      if (blockItem.blockType === "regex") {
        return regexMatch(url, blockItem.url);
      }
      return url.includes(blockItem.url);
    };

    const checkIfCanEnterWebsite = async (
      info: chrome.webNavigation.WebNavigationTransitionCallbackDetails,
    ) => {
      if (info.frameId !== 0 || !isValidURL(info.url)) {
        return;
      }

      let isExtensionActive: boolean;
      try {
        isExtensionActive = await storage.get<boolean>("active");
      } catch {
        return;
      }
      if (!isExtensionActive) {
        return;
      }

      try {
        const settings = await storage.get<Settings>("settings");
        if (settings.workHours?.enableWorkHours) {
          const isWorkDay = isTodayOneOfTheseDays(settings.workHours.days);
          const isWithinWorkTime = isCurrentTimeBetweenTwoTimes(
            settings.workHours.startTime,
            settings.workHours.endTime,
          );
          if (!(isWorkDay && isWithinWorkTime)) {
            return;
          }
        }
      } catch {
        return;
      }

      try {
        const sitesGroups = await storage.get<SiteGroup[]>("sitesGroups");
        const blockedWebsites = getFlatEnabledListOfWebsites(sitesGroups);
        const isBlocked = blockedWebsites.some((website) =>
          checkIfMatch(website, info.url),
        );
        if (isBlocked) {
          await chrome.tabs.update(info.tabId, { url: "/goback/index.html" });
        }
      } catch {
        // No sites configured
      }
    };

    chrome.webNavigation.onCommitted.addListener(checkIfCanEnterWebsite);
    chrome.webNavigation.onCommitted.addListener(chooseIconColor);

    chrome.runtime.onInstalled.addListener(async (details) => {
      const currentVersion = chrome.runtime.getManifest().version;
      const previousVersion = details.previousVersion;
      await storage.set("version", currentVersion);

      switch (details.reason) {
        case "install":
          await storage.set("sitesGroups", websitesListDefault);
          await storage.set("settings", settingsDefault);
          await storage.set("active", activeDefault);
          console.log("Installed Successfully");
          break;
        case "update":
          console.log(
            `prev version: ${previousVersion}, current version: ${currentVersion}`,
          );
          if (previousVersion) {
            await handle103To104Upgrade(previousVersion, currentVersion);
          }
          console.log("Updated Successfully");
          break;
      }
    });
  },
});
