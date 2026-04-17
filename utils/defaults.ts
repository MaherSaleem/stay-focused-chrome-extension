import type { SiteGroup, Settings } from "./types";
import { getUniqueId } from "./helpers";

export function makeSiteGroup(
  groupName: string,
  enabled: boolean,
  sites: Array<{ url: string; enabled: boolean }> = [],
  blockType: "website" | "word" | "regex" = "website",
  uid: string = getUniqueId(),
): SiteGroup {
  return { groupName, sitesList: sites, uid, groupEnabled: enabled, blockType };
}

export function makeSite(url: string, enabled = true) {
  return { url, enabled };
}

export const settingsDefault: Settings = {
  workHours: {
    startTime: "08:00 AM",
    endTime: "05:00 PM",
    days: ["1", "2", "3", "4", "5"],
    enableWorkHours: false,
  },
  allowFunnyGoBackImages: true,
  lock: {
    type: "click-button",
    password: "",
    questionNumberOfTries: 3,
    clickButtonCounts: 8,
  },
};

export const websitesListDefault: SiteGroup[] = [
  makeSiteGroup("Social Media Sites", true, [
    makeSite("facebook.com"),
    makeSite("twitter.com"),
    makeSite("x.com"),
    makeSite("instagram.com"),
    makeSite("linkedin.com"),
  ]),
  makeSiteGroup("Videos Sites", false, [
    makeSite("youtube.com"),
    makeSite("netflix.com"),
    makeSite("dailymotion.com"),
  ]),
  makeSiteGroup("Blocked Using a Word", true, [], "word"),
  makeSiteGroup("Blocked Using Regex", true, [], "regex"),
];

export const activeDefault = false;
