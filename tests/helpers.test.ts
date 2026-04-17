import { describe, it, expect } from "vitest";
import {
  isValidURL,
  isTodayOneOfTheseDays,
  isCurrentTimeBetweenTwoTimes,
  getFlatEnabledListOfWebsites,
  getFlatListOfWebsites,
  getUniqueId,
  truncateText,
  regexMatch,
  versionCompare,
} from "../utils/helpers";
import type { SiteGroup } from "../utils/types";

describe("isValidURL", () => {
  it("accepts valid URLs", () => {
    expect(isValidURL("https://facebook.com")).toBe(true);
    expect(isValidURL("http://example.com")).toBe(true);
    expect(isValidURL("google.com")).toBe(true);
    expect(isValidURL("https://sub.domain.co.uk/path")).toBe(true);
  });

  it("rejects invalid URLs", () => {
    expect(isValidURL("")).toBe(false);
    expect(isValidURL("not a url")).toBe(false);
    expect(isValidURL("chrome://extensions")).toBe(false);
  });
});

describe("isTodayOneOfTheseDays", () => {
  it("returns true when today's day index is in the list", () => {
    const todayIndex = new Date().getDay().toString();
    expect(isTodayOneOfTheseDays([todayIndex])).toBe(true);
  });

  it("returns false when today's day index is not in the list", () => {
    // Use a day index that can't be today (we test both 8 and 9 which are never valid)
    expect(isTodayOneOfTheseDays(["8", "9"])).toBe(false);
  });

  it("returns true for weekdays list on a weekday", () => {
    const todayIndex = new Date().getDay();
    const weekdays = ["1", "2", "3", "4", "5"];
    if (todayIndex >= 1 && todayIndex <= 5) {
      expect(isTodayOneOfTheseDays(weekdays)).toBe(true);
    }
  });
});

describe("isCurrentTimeBetweenTwoTimes", () => {
  it("returns true when current time is between start and end", () => {
    // Use a range that covers the entire day
    expect(isCurrentTimeBetweenTwoTimes("12:00 AM", "11:59 PM")).toBe(true);
  });

  it("returns false when current time is outside the range", () => {
    // Use a range in the past (00:00 - 00:01)
    const now = new Date();
    if (now.getHours() > 0 || now.getMinutes() > 1) {
      expect(isCurrentTimeBetweenTwoTimes("12:00 AM", "12:01 AM")).toBe(false);
    }
  });
});

describe("getFlatListOfWebsites", () => {
  const siteGroups: SiteGroup[] = [
    {
      groupName: "Social",
      sitesList: [
        { url: "facebook.com", enabled: true },
        { url: "twitter.com", enabled: false },
      ],
      uid: "g1",
      groupEnabled: true,
      blockType: "website",
    },
    {
      groupName: "Videos",
      sitesList: [{ url: "youtube.com", enabled: true }],
      uid: "g2",
      groupEnabled: false,
      blockType: "website",
    },
  ];

  it("flattens all sites across groups", () => {
    const flat = getFlatListOfWebsites(siteGroups);
    expect(flat).toHaveLength(3);
    expect(flat[0].url).toBe("facebook.com");
    expect(flat[1].url).toBe("twitter.com");
    expect(flat[2].url).toBe("youtube.com");
  });

  it("includes groupEnabled and blockType on each site", () => {
    const flat = getFlatListOfWebsites(siteGroups);
    expect(flat[0].groupEnabled).toBe(true);
    expect(flat[0].blockType).toBe("website");
    expect(flat[2].groupEnabled).toBe(false);
  });
});

describe("getFlatEnabledListOfWebsites", () => {
  const siteGroups: SiteGroup[] = [
    {
      groupName: "Social",
      sitesList: [
        { url: "facebook.com", enabled: true },
        { url: "twitter.com", enabled: false },
      ],
      uid: "g1",
      groupEnabled: true,
      blockType: "website",
    },
    {
      groupName: "Videos",
      sitesList: [{ url: "youtube.com", enabled: true }],
      uid: "g2",
      groupEnabled: false,
      blockType: "website",
    },
  ];

  it("only returns sites where both group and site are enabled", () => {
    const enabled = getFlatEnabledListOfWebsites(siteGroups);
    expect(enabled).toHaveLength(1);
    expect(enabled[0].url).toBe("facebook.com");
  });

  it("excludes sites where group is disabled even if site is enabled", () => {
    const enabled = getFlatEnabledListOfWebsites(siteGroups);
    expect(enabled.find((s) => s.url === "youtube.com")).toBeUndefined();
  });

  it("excludes sites where site is disabled even if group is enabled", () => {
    const enabled = getFlatEnabledListOfWebsites(siteGroups);
    expect(enabled.find((s) => s.url === "twitter.com")).toBeUndefined();
  });
});

describe("getUniqueId", () => {
  it("generates a string of default length 6", () => {
    const id = getUniqueId();
    expect(id).toHaveLength(6);
    expect(typeof id).toBe("string");
  });

  it("generates a string of specified length", () => {
    expect(getUniqueId(10)).toHaveLength(10);
    expect(getUniqueId(1)).toHaveLength(1);
  });

  it("generates different IDs on consecutive calls", () => {
    const ids = new Set(Array.from({ length: 100 }, () => getUniqueId()));
    expect(ids.size).toBeGreaterThan(90); // allow small collision chance
  });
});

describe("truncateText", () => {
  it("returns short text unchanged", () => {
    expect(truncateText("hello")).toBe("hello");
  });

  it("truncates long text with ellipsis", () => {
    const long = "a".repeat(50);
    expect(truncateText(long)).toBe("a".repeat(30) + "...");
  });

  it("respects custom length", () => {
    expect(truncateText("hello world", 5)).toBe("hello...");
  });
});

describe("regexMatch", () => {
  it("matches a regex pattern", () => {
    expect(regexMatch("https://facebook.com/page", "facebook\\.com")).toBe(true);
  });

  it("returns false for non-matching pattern", () => {
    expect(regexMatch("https://google.com", "facebook\\.com")).toBe(false);
  });

  it("supports complex regex", () => {
    expect(regexMatch("https://news.ycombinator.com", "^https://news\\.")).toBe(true);
  });
});

describe("versionCompare", () => {
  it("returns 0 for equal versions", () => {
    expect(versionCompare("1.0.0", "1.0.0")).toBe(0);
    expect(versionCompare("1.0.3", "1.0.3")).toBe(0);
  });

  it("returns 1 when first version is greater", () => {
    expect(versionCompare("1.0.4", "1.0.3")).toBe(1);
    expect(versionCompare("2.0.0", "1.9.9")).toBe(1);
    expect(versionCompare("1.1.0", "1.0.9")).toBe(1);
  });

  it("returns -1 when first version is less", () => {
    expect(versionCompare("1.0.3", "1.0.4")).toBe(-1);
    expect(versionCompare("1.0.0", "2.0.0")).toBe(-1);
  });

  it("handles versions with different segment counts", () => {
    expect(versionCompare("1.0", "1.0.0")).toBe(0);
    expect(versionCompare("1.0.0", "1.0")).toBe(0);
    expect(versionCompare("1.0.1", "1.0")).toBe(1);
  });
});
