/**
 * Tests that every CRUD operation correctly persists data to chrome.storage.local.
 *
 * Uses the mock chrome.storage.local to verify:
 * - The correct key ("sitesGroups") is written
 * - The stored JSON has the expected shape after each operation
 * - No data corruption (Proxy wrappers, missing fields, wrong types)
 */
import { describe, it, expect, beforeEach } from "vitest";
import { resetMockStore, mockStore } from "./mocks/chromeStorage";
import { chromeStorage } from "../utils/storage";
import { makeSiteGroup, makeSite, settingsDefault, activeDefault } from "../utils/defaults";
import type { SiteGroup, Settings } from "../utils/types";

// Helper to get stored value with type
function getStored<T>(key: string): T {
  return mockStore[key] as T;
}

describe("chromeStorage — read/write roundtrip", () => {
  beforeEach(() => {
    resetMockStore();
  });

  it("set then get returns the same data", async () => {
    const groups: SiteGroup[] = [
      makeSiteGroup("Test", true, [makeSite("example.com")], "website", "g1"),
    ];

    await chromeStorage.set("sitesGroups", groups);
    const retrieved = await chromeStorage.get<SiteGroup[]>("sitesGroups");

    expect(retrieved).toEqual(groups);
  });

  it("get rejects when key is missing", async () => {
    await expect(chromeStorage.get("nonexistent")).rejects.toBe("");
  });

  it("strips Vue-like nested objects cleanly via JSON clone", async () => {
    const groups: SiteGroup[] = [
      makeSiteGroup("Social", true, [makeSite("facebook.com"), makeSite("twitter.com")], "website", "g1"),
    ];

    await chromeStorage.set("sitesGroups", groups);
    const stored = getStored<SiteGroup[]>("sitesGroups");

    // Verify it's plain JSON — re-serializing should produce identical result
    expect(JSON.parse(JSON.stringify(stored))).toEqual(stored);
  });
});

describe("Storage persistence — sitesGroups CRUD", () => {
  beforeEach(() => {
    resetMockStore();
  });

  describe("Adding a site to a group", () => {
    it("prepends the new site and saves all groups", async () => {
      const groups: SiteGroup[] = [
        makeSiteGroup("Social", true, [makeSite("facebook.com")], "website", "g1"),
        makeSiteGroup("Videos", false, [makeSite("youtube.com")], "website", "g2"),
      ];

      // Simulate what BlockItemBaseTab.addNewSite does
      const newSite = makeSite("twitter.com", true);
      groups[0].sitesList = [newSite, ...groups[0].sitesList];

      await chromeStorage.set("sitesGroups", groups);

      const stored = getStored<SiteGroup[]>("sitesGroups");
      expect(stored).toHaveLength(2);
      expect(stored[0].sitesList).toHaveLength(2);
      expect(stored[0].sitesList[0].url).toBe("twitter.com");
      expect(stored[0].sitesList[0].enabled).toBe(true);
      expect(stored[0].sitesList[1].url).toBe("facebook.com");
      // Other group untouched
      expect(stored[1].sitesList[0].url).toBe("youtube.com");
    });
  });

  describe("Deleting a site from a group", () => {
    it("removes the site at given index and preserves others", async () => {
      const groups: SiteGroup[] = [
        makeSiteGroup(
          "Social",
          true,
          [makeSite("facebook.com", true), makeSite("twitter.com", false), makeSite("x.com", true)],
          "website",
          "g1",
        ),
      ];

      // Simulate deleting twitter.com (index 1)
      groups[0].sitesList.splice(1, 1);

      await chromeStorage.set("sitesGroups", groups);

      const stored = getStored<SiteGroup[]>("sitesGroups");
      expect(stored[0].sitesList).toHaveLength(2);
      expect(stored[0].sitesList[0]).toEqual({ url: "facebook.com", enabled: true });
      expect(stored[0].sitesList[1]).toEqual({ url: "x.com", enabled: true });
    });

    it("does not corrupt other sites' enabled state after deletion", async () => {
      const groups: SiteGroup[] = [
        makeSiteGroup(
          "Social",
          true,
          [
            makeSite("a.com", true),
            makeSite("b.com", false),
            makeSite("c.com", true),
            makeSite("d.com", false),
          ],
          "website",
          "g1",
        ),
      ];

      // Delete b.com (index 1)
      groups[0].sitesList.splice(1, 1);

      await chromeStorage.set("sitesGroups", groups);

      const stored = getStored<SiteGroup[]>("sitesGroups");
      const sites = stored[0].sitesList;
      expect(sites).toHaveLength(3);
      expect(sites[0]).toEqual({ url: "a.com", enabled: true });
      expect(sites[1]).toEqual({ url: "c.com", enabled: true });
      expect(sites[2]).toEqual({ url: "d.com", enabled: false });
    });
  });

  describe("Toggling a site", () => {
    it("persists the toggled enabled state", async () => {
      const groups: SiteGroup[] = [
        makeSiteGroup(
          "Social",
          true,
          [makeSite("facebook.com", true), makeSite("twitter.com", true)],
          "website",
          "g1",
        ),
      ];

      // Simulate toggling facebook.com off
      groups[0].sitesList[0].enabled = false;

      await chromeStorage.set("sitesGroups", groups);

      const stored = getStored<SiteGroup[]>("sitesGroups");
      expect(stored[0].sitesList[0].enabled).toBe(false);
      expect(stored[0].sitesList[1].enabled).toBe(true);
    });
  });

  describe("Toggling a group", () => {
    it("persists the toggled groupEnabled state", async () => {
      const groups: SiteGroup[] = [
        makeSiteGroup("Social", true, [makeSite("facebook.com")], "website", "g1"),
      ];

      groups[0].groupEnabled = false;

      await chromeStorage.set("sitesGroups", groups);

      const stored = getStored<SiteGroup[]>("sitesGroups");
      expect(stored[0].groupEnabled).toBe(false);
      // Site inside should be untouched
      expect(stored[0].sitesList[0].enabled).toBe(true);
    });
  });

  describe("Adding a group", () => {
    it("prepends the new group", async () => {
      const groups: SiteGroup[] = [
        makeSiteGroup("Social", true, [makeSite("facebook.com")], "website", "g1"),
      ];

      // Simulate adding a new group
      const newGroup = makeSiteGroup("E-Commerce", true, [], "website", "g-new");
      const updated = [newGroup, ...groups];

      await chromeStorage.set("sitesGroups", updated);

      const stored = getStored<SiteGroup[]>("sitesGroups");
      expect(stored).toHaveLength(2);
      expect(stored[0].groupName).toBe("E-Commerce");
      expect(stored[0].uid).toBe("g-new");
      expect(stored[1].uid).toBe("g1");
    });
  });

  describe("Deleting a group", () => {
    it("removes the group and preserves others", async () => {
      const groups: SiteGroup[] = [
        makeSiteGroup("Social", true, [makeSite("facebook.com")], "website", "g1"),
        makeSiteGroup("Videos", true, [makeSite("youtube.com")], "website", "g2"),
        makeSiteGroup("News", true, [makeSite("bbc.com")], "website", "g3"),
      ];

      // Simulate deleting Videos (index 1)
      groups.splice(1, 1);

      await chromeStorage.set("sitesGroups", groups);

      const stored = getStored<SiteGroup[]>("sitesGroups");
      expect(stored).toHaveLength(2);
      expect(stored[0].uid).toBe("g1");
      expect(stored[1].uid).toBe("g3");
    });
  });
});

describe("Storage persistence — settings", () => {
  beforeEach(() => {
    resetMockStore();
  });

  it("persists settings with correct structure", async () => {
    await chromeStorage.set("settings", settingsDefault);

    const stored = getStored<Settings>("settings");
    expect(stored.workHours.startTime).toBe("08:00 AM");
    expect(stored.workHours.endTime).toBe("05:00 PM");
    expect(stored.workHours.days).toEqual(["1", "2", "3", "4", "5"]);
    expect(stored.workHours.enableWorkHours).toBe(false);
    expect(stored.allowFunnyGoBackImages).toBe(true);
    expect(stored.lock.type).toBe("click-button");
    expect(stored.lock.clickButtonCounts).toBe(8);
  });

  it("persists lock type change", async () => {
    const settings = structuredClone(settingsDefault);
    settings.lock.type = "password";
    settings.lock.password = "secret123";

    await chromeStorage.set("settings", settings);

    const stored = getStored<Settings>("settings");
    expect(stored.lock.type).toBe("password");
    expect(stored.lock.password).toBe("secret123");
  });

  it("persists work hours changes", async () => {
    const settings = structuredClone(settingsDefault);
    settings.workHours.enableWorkHours = true;
    settings.workHours.startTime = "09:00 AM";
    settings.workHours.endTime = "06:00 PM";
    settings.workHours.days = ["1", "2", "3", "4", "5", "6"];

    await chromeStorage.set("settings", settings);

    const stored = getStored<Settings>("settings");
    expect(stored.workHours.enableWorkHours).toBe(true);
    expect(stored.workHours.startTime).toBe("09:00 AM");
    expect(stored.workHours.days).toContain("6");
  });
});

describe("Storage persistence — active state", () => {
  beforeEach(() => {
    resetMockStore();
  });

  it("persists active toggle", async () => {
    await chromeStorage.set("active", true);
    expect(getStored<boolean>("active")).toBe(true);

    await chromeStorage.set("active", false);
    expect(getStored<boolean>("active")).toBe(false);
  });
});
