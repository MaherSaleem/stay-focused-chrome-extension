import type { SiteGroup, Site } from "./types";
import { setExtensionIcon } from "./storage";

export function isValidURL(str: string): boolean {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i",
  );
  return pattern.test(str);
}

export function getHostNameFromStringUrl(url: string): string {
  const a = document.createElement("a");
  if (!url.startsWith("http")) {
    url = "http://" + url;
  }
  a.href = url;
  let hostName = a.hostname;
  if (hostName.startsWith("www.")) {
    hostName = hostName.substring(4);
  }
  return hostName;
}

export function isTodayOneOfTheseDays(days: string[]): boolean {
  const dayIndex = new Date().getDay();
  return days.includes(dayIndex.toString());
}

export function isCurrentTimeBetweenTwoTimes(
  startTime: string,
  endTime: string,
): boolean {
  const currentDate = new Date();
  const convertTimeToDate = (timeString: string): Date => {
    const timeAsDate = new Date(currentDate.getTime());
    timeAsDate.setHours(parseInt(timeString.substring(0, 2)));
    timeAsDate.setMinutes(parseInt(timeString.substring(3, 5)));
    timeAsDate.setSeconds(0);
    const isPM = timeString.substring(6, 8) === "PM";
    if (isPM) {
      timeAsDate.setHours(timeAsDate.getHours() + 12);
    }
    return timeAsDate;
  };
  const startTimeAsDate = convertTimeToDate(startTime);
  const endTimeAsDate = convertTimeToDate(endTime);
  return startTimeAsDate < currentDate && endTimeAsDate > currentDate;
}

export function setIcon(isActive: boolean): void {
  const iconPath = isActive
    ? "/icons/icon_48_active.ico"
    : "/icons/icon_48_inactive.ico";
  setExtensionIcon(iconPath);
}

export function getFlatEnabledListOfWebsites(
  groupsList: SiteGroup[],
): Array<Site & { groupEnabled: boolean; blockType: string }> {
  return getFlatListOfWebsites(groupsList).filter(
    (site) => site.groupEnabled && site.enabled,
  );
}

export function getFlatListOfWebsites(
  groupsList: SiteGroup[],
): Array<Site & { groupEnabled: boolean; blockType: string }> {
  const flatList: Array<Site & { groupEnabled: boolean; blockType: string }> = [];
  groupsList.forEach((siteGroup) => {
    flatList.push(
      ...siteGroup.sitesList.map((site) => ({
        ...site,
        groupEnabled: siteGroup.groupEnabled,
        blockType: siteGroup.blockType,
      })),
    );
  });
  return flatList;
}

export function getUniqueId(numberOfChars = 6): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < numberOfChars; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function truncateText(value: string, charsLength = 30): string {
  return value.length <= charsLength
    ? value
    : value.substring(0, charsLength) + "...";
}

export function regexMatch(stringToTest: string, regexString: string): boolean {
  const re = new RegExp(regexString);
  return re.test(stringToTest);
}

export function versionCompare(v1: string, v2: string): number {
  const v1parts = v1.split(".").map(Number);
  const v2parts = v2.split(".").map(Number);
  for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
    const a = v1parts[i] ?? 0;
    const b = v2parts[i] ?? 0;
    if (a > b) return 1;
    if (a < b) return -1;
  }
  return 0;
}
