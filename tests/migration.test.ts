import { describe, it, expect, beforeEach } from "vitest";
import { resetMockStore, mockStore } from "./mocks/chromeStorage";
import "./mocks/chromeStorage"; // install chrome mock
import { handle103To104Upgrade } from "../utils/migration";
import { makeSiteGroup, makeSite } from "../utils/defaults";
import type { SiteGroup } from "../utils/types";

describe("handle103To104Upgrade", () => {
  beforeEach(() => {
    resetMockStore();
  });

  it("adds blockType and word/regex groups when upgrading from 1.0.3 to 1.0.4", async () => {
    // Simulate pre-1.0.4 data: groups without blockType
    const oldGroups = [
      {
        groupName: "Social",
        sitesList: [{ url: "facebook.com", enabled: true }],
        uid: "g1",
        groupEnabled: true,
        // no blockType field
      },
    ];
    resetMockStore({ sitesGroups: oldGroups });

    await handle103To104Upgrade("1.0.3", "1.0.4");

    const stored = mockStore.sitesGroups as SiteGroup[];
    expect(stored).toHaveLength(3); // original + word + regex
    expect(stored[0].blockType).toBe("website"); // default added
    expect(stored[1].blockType).toBe("word");
    expect(stored[1].groupName).toBe("Blocked By Word");
    expect(stored[2].blockType).toBe("regex");
    expect(stored[2].groupName).toBe("Blocked By Regex");
  });

  it("does NOT run when upgrading from 1.0.4 to 1.0.5", async () => {
    const groups = [
      makeSiteGroup("Social", true, [makeSite("facebook.com")], "website", "g1"),
    ];
    resetMockStore({ sitesGroups: groups });

    await handle103To104Upgrade("1.0.4", "1.0.5");

    const stored = mockStore.sitesGroups as SiteGroup[];
    // Should be unchanged — no word/regex groups added
    expect(stored).toHaveLength(1);
  });

  it("does NOT run when both versions are below 1.0.4", async () => {
    const groups = [
      makeSiteGroup("Social", true, [makeSite("facebook.com")], "website", "g1"),
    ];
    resetMockStore({ sitesGroups: groups });

    await handle103To104Upgrade("1.0.2", "1.0.3");

    const stored = mockStore.sitesGroups as SiteGroup[];
    expect(stored).toHaveLength(1);
  });

  it("preserves existing sites when adding blockType", async () => {
    const oldGroups = [
      {
        groupName: "Social",
        sitesList: [
          { url: "facebook.com", enabled: true },
          { url: "twitter.com", enabled: false },
        ],
        uid: "g1",
        groupEnabled: true,
      },
    ];
    resetMockStore({ sitesGroups: oldGroups });

    await handle103To104Upgrade("1.0.3", "1.0.4");

    const stored = mockStore.sitesGroups as SiteGroup[];
    expect(stored[0].sitesList).toHaveLength(2);
    expect(stored[0].sitesList[0].url).toBe("facebook.com");
    expect(stored[0].sitesList[1].enabled).toBe(false);
  });
});
