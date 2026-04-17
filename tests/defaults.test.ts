import { describe, it, expect } from "vitest";
import {
  makeSiteGroup,
  makeSite,
  settingsDefault,
  websitesListDefault,
  activeDefault,
} from "../utils/defaults";

describe("makeSite", () => {
  it("creates a site with defaults", () => {
    const site = makeSite("facebook.com");
    expect(site).toEqual({ url: "facebook.com", enabled: true });
  });

  it("creates a disabled site", () => {
    const site = makeSite("facebook.com", false);
    expect(site).toEqual({ url: "facebook.com", enabled: false });
  });
});

describe("makeSiteGroup", () => {
  it("creates a group with defaults", () => {
    const group = makeSiteGroup("Test Group", true);
    expect(group.groupName).toBe("Test Group");
    expect(group.groupEnabled).toBe(true);
    expect(group.sitesList).toEqual([]);
    expect(group.blockType).toBe("website");
    expect(group.uid).toHaveLength(6);
  });

  it("creates a group with sites", () => {
    const sites = [makeSite("a.com"), makeSite("b.com")];
    const group = makeSiteGroup("Test", true, sites);
    expect(group.sitesList).toHaveLength(2);
    expect(group.sitesList[0].url).toBe("a.com");
  });

  it("creates a word block type group", () => {
    const group = makeSiteGroup("Words", true, [], "word");
    expect(group.blockType).toBe("word");
  });

  it("creates a group with custom uid", () => {
    const group = makeSiteGroup("Test", true, [], "website", "custom-uid");
    expect(group.uid).toBe("custom-uid");
  });

  it("generates unique uids", () => {
    const g1 = makeSiteGroup("A", true);
    const g2 = makeSiteGroup("B", true);
    expect(g1.uid).not.toBe(g2.uid);
  });
});

describe("defaults", () => {
  it("activeDefault is false", () => {
    expect(activeDefault).toBe(false);
  });

  it("settingsDefault has expected structure", () => {
    expect(settingsDefault.workHours.enableWorkHours).toBe(false);
    expect(settingsDefault.workHours.startTime).toBe("08:00 AM");
    expect(settingsDefault.workHours.endTime).toBe("05:00 PM");
    expect(settingsDefault.workHours.days).toEqual(["1", "2", "3", "4", "5"]);
    expect(settingsDefault.allowFunnyGoBackImages).toBe(true);
    expect(settingsDefault.lock.type).toBe("click-button");
    expect(settingsDefault.lock.clickButtonCounts).toBe(8);
  });

  it("websitesListDefault has 4 groups", () => {
    expect(websitesListDefault).toHaveLength(4);
    expect(websitesListDefault[0].groupName).toBe("Social Media Sites");
    expect(websitesListDefault[0].blockType).toBe("website");
    expect(websitesListDefault[2].blockType).toBe("word");
    expect(websitesListDefault[3].blockType).toBe("regex");
  });

  it("Social Media Sites group has expected sites", () => {
    const social = websitesListDefault[0];
    const urls = social.sitesList.map((s) => s.url);
    expect(urls).toContain("facebook.com");
    expect(urls).toContain("twitter.com");
    expect(urls).toContain("x.com");
    expect(urls).toContain("instagram.com");
    expect(urls).toContain("linkedin.com");
  });
});
