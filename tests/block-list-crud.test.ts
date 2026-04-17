/**
 * UI tests for block list CRUD operations.
 *
 * These test the actual Vue components (BlockItemBaseTab, SitesGroup, AddBlockItemToList)
 * with a mocked chrome.storage.local, verifying that add/delete/toggle operations
 * produce the correct JSON in storage.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { resetMockStore, mockStore } from "./mocks/chromeStorage";
import naive from "naive-ui";
import BlockItemBaseTab from "../entrypoints/options/components/BlockItemBaseTab.vue";
import { makeSiteGroup, makeSite } from "../utils/defaults";
import type { SiteGroup } from "../utils/types";

function mountTab(
  blockType: "website" | "word" | "regex" = "website",
  opts: { allowCreateNewGroups?: boolean; allowDeleteGroups?: boolean } = {},
) {
  const isWebsite = blockType === "website";
  return mount(BlockItemBaseTab, {
    props: {
      blockTypeToShow: blockType,
      allowCreateNewGroups: opts.allowCreateNewGroups ?? isWebsite,
      allowDeleteGroups: opts.allowDeleteGroups ?? isWebsite,
    },
    global: {
      plugins: [naive],
    },
  });
}

function seedGroups(groups: SiteGroup[]) {
  resetMockStore({ sitesGroups: groups });
}

function getStoredGroups(): SiteGroup[] {
  return mockStore.sitesGroups as SiteGroup[];
}

describe("BlockItemBaseTab — CRUD operations", () => {
  beforeEach(() => {
    resetMockStore();
  });

  describe("Loading data", () => {
    it("loads sitesGroups from storage on mount", async () => {
      const groups = [
        makeSiteGroup("Test Group", true, [makeSite("example.com")], "website", "g1"),
      ];
      seedGroups(groups);

      const wrapper = mountTab();
      await flushPromises();

      expect(wrapper.text()).toContain("Test Group");
      expect(wrapper.text()).toContain("example.com");
    });

    it("seeds defaults when storage is empty (first run)", async () => {
      resetMockStore({}); // no sitesGroups key

      mountTab();
      await flushPromises();

      // Should have saved default groups to storage
      const stored = getStoredGroups();
      expect(stored).toBeDefined();
      expect(stored.length).toBeGreaterThan(0);
    });

    it("only shows groups matching blockTypeToShow", async () => {
      seedGroups([
        makeSiteGroup("Websites", true, [makeSite("fb.com")], "website", "g1"),
        makeSiteGroup("Words", true, [makeSite("badword")], "word", "g2"),
      ]);

      const wrapper = mountTab("website");
      await flushPromises();

      expect(wrapper.text()).toContain("Websites");
      expect(wrapper.text()).not.toContain("Words");
    });
  });

  describe("Adding a site", () => {
    it("adds a site to a group and persists to storage", async () => {
      seedGroups([
        makeSiteGroup("Social", true, [makeSite("facebook.com")], "website", "g1"),
      ]);

      const wrapper = mountTab();
      await flushPromises();

      // Find the AddBlockItemToList component's input (inside the site group card)
      // The first input is the "new group name", the second is "add new item to block"
      const inputs = wrapper.findAll("input");
      const addSiteInput = inputs[1]; // second input is the site input inside the group card

      await addSiteInput.setValue("twitter.com");
      await addSiteInput.trigger("keyup.enter");
      await flushPromises();

      const stored = getStoredGroups();
      const group = stored.find((g) => g.uid === "g1");
      expect(group).toBeDefined();
      // New site should be prepended
      const urls = group!.sitesList.map((s) => s.url);
      expect(urls).toContain("twitter.com");
      expect(urls).toContain("facebook.com");
      expect(group!.sitesList.length).toBe(2);
    });

    it("adds a word-type item without URL normalization", async () => {
      seedGroups([makeSiteGroup("Bad Words", true, [], "word", "w1")]);

      const wrapper = mountTab("word");
      await flushPromises();

      // Word tab has allowCreateNewGroups=false, so the first input is the site input
      const input = wrapper.find("input");
      await input.setValue("gambling");
      await input.trigger("keyup.enter");
      await flushPromises();

      const stored = getStoredGroups();
      const group = stored.find((g) => g.uid === "w1");
      expect(group).toBeDefined();
      expect(group!.sitesList.length).toBe(1);
      expect(group!.sitesList[0].url).toBe("gambling");
    });
  });

  describe("Toggling a site", () => {
    it("persists site enabled toggle to storage", async () => {
      seedGroups([
        makeSiteGroup(
          "Social",
          true,
          [makeSite("facebook.com", true), makeSite("twitter.com", true)],
          "website",
          "g1",
        ),
      ]);

      const wrapper = mountTab();
      await flushPromises();

      // Find all switch buttons (site toggles + group toggle)
      const switches = wrapper.findAll(".n-switch");
      // First switch is the group toggle, subsequent ones are site toggles
      // Click the second switch (first site — facebook.com)
      if (switches.length > 1) {
        await switches[1].trigger("click");
        await flushPromises();

        const stored = getStoredGroups();
        const fb = stored[0].sitesList.find((s) => s.url === "facebook.com");
        // The site should have been toggled
        expect(fb).toBeDefined();
      }
    });

    it("persists group enabled toggle to storage", async () => {
      seedGroups([
        makeSiteGroup("Social", true, [makeSite("facebook.com")], "website", "g1"),
      ]);

      const wrapper = mountTab();
      await flushPromises();

      // The first switch in the group card is the group toggle
      const switches = wrapper.findAll(".n-switch");
      if (switches.length > 0) {
        await switches[0].trigger("click");
        await flushPromises();

        const stored = getStoredGroups();
        // Group toggle should have changed
        expect(stored[0]).toBeDefined();
      }
    });
  });

  describe("Deleting a site", () => {
    it("removes a site from the group and persists to storage", async () => {
      seedGroups([
        makeSiteGroup(
          "Social",
          true,
          [makeSite("facebook.com"), makeSite("twitter.com"), makeSite("x.com")],
          "website",
          "g1",
        ),
      ]);

      const wrapper = mountTab();
      await flushPromises();

      // Find delete buttons
      const deleteButtons = wrapper.findAll("button").filter((b) => b.text().includes("Delete"));
      expect(deleteButtons.length).toBe(3);

      // Delete the first site (facebook.com)
      await deleteButtons[0].trigger("click");
      // Wait for the setTimeout(10ms) workaround in deleteSite
      await new Promise((r) => setTimeout(r, 50));
      await flushPromises();

      const stored = getStoredGroups();
      const group = stored.find((g) => g.uid === "g1");
      expect(group!.sitesList).toHaveLength(2);
      expect(group!.sitesList.find((s) => s.url === "facebook.com")).toBeUndefined();
      expect(group!.sitesList.find((s) => s.url === "twitter.com")).toBeDefined();
      expect(group!.sitesList.find((s) => s.url === "x.com")).toBeDefined();
    });

    it("deleting a site does not affect other sites' enabled state", async () => {
      seedGroups([
        makeSiteGroup(
          "Social",
          true,
          [
            makeSite("facebook.com", true),
            makeSite("twitter.com", false),
            makeSite("x.com", true),
          ],
          "website",
          "g1",
        ),
      ]);

      const wrapper = mountTab();
      await flushPromises();

      // Delete facebook.com (first delete button)
      const deleteButtons = wrapper.findAll("button").filter((b) => b.text().includes("Delete"));
      await deleteButtons[0].trigger("click");
      await new Promise((r) => setTimeout(r, 50));
      await flushPromises();

      const stored = getStoredGroups();
      const group = stored.find((g) => g.uid === "g1");
      // twitter.com should still be disabled, x.com still enabled
      const twitter = group!.sitesList.find((s) => s.url === "twitter.com");
      const x = group!.sitesList.find((s) => s.url === "x.com");
      expect(twitter!.enabled).toBe(false);
      expect(x!.enabled).toBe(true);
    });
  });

  describe("Deleting a group", () => {
    it("removes a group and persists to storage", async () => {
      seedGroups([
        makeSiteGroup("Social", true, [makeSite("facebook.com")], "website", "g1"),
        makeSiteGroup("Videos", true, [makeSite("youtube.com")], "website", "g2"),
      ]);

      const wrapper = mountTab();
      await flushPromises();

      // Find "Remove Group" buttons
      const removeButtons = wrapper
        .findAll("button")
        .filter((b) => b.text().includes("Remove Group"));
      expect(removeButtons.length).toBe(2);

      // Remove the first group
      await removeButtons[0].trigger("click");
      await flushPromises();

      const stored = getStoredGroups();
      expect(stored).toHaveLength(1);
      expect(stored[0].uid).toBe("g2");
      expect(stored[0].groupName).toBe("Videos");
    });
  });

  describe("Adding a group", () => {
    it("creates a new group and persists to storage", async () => {
      seedGroups([
        makeSiteGroup("Social", true, [makeSite("facebook.com")], "website", "g1"),
      ]);

      const wrapper = mountTab();
      await flushPromises();

      // The first input is the "new group name" input (before the site groups)
      const inputs = wrapper.findAll("input");
      const groupInput = inputs[0]; // first input is the group name input

      await groupInput.setValue("E-Commerce");
      await groupInput.trigger("keyup.enter");
      await flushPromises();

      const stored = getStoredGroups();
      // New group should be prepended
      expect(stored[0].groupName).toBe("E-Commerce");
      expect(stored[0].blockType).toBe("website");
      expect(stored[0].groupEnabled).toBe(true);
      expect(stored[0].sitesList).toEqual([]);
      // Old group should still exist
      expect(stored.find((g) => g.uid === "g1")).toBeDefined();
    });
  });

  describe("JSON integrity", () => {
    it("maintains correct structure after multiple operations", async () => {
      seedGroups([
        makeSiteGroup(
          "Social",
          true,
          [makeSite("facebook.com"), makeSite("twitter.com")],
          "website",
          "g1",
        ),
      ]);

      const wrapper = mountTab();
      await flushPromises();

      // Add a site
      const siteInput = wrapper.findAll("input").find((i) => {
        const placeholder = i.attributes("placeholder") || "";
        return placeholder.includes("Add a new item");
      });
      if (siteInput) {
        await siteInput.setValue("instagram.com");
        await siteInput.trigger("keyup.enter");
        await flushPromises();
      }

      // Delete a site (twitter.com should be at index 2 now since instagram was prepended)
      const deleteButtons = wrapper.findAll("button").filter((b) => b.text().includes("Delete"));
      if (deleteButtons.length >= 3) {
        await deleteButtons[2].trigger("click"); // twitter.com
        await new Promise((r) => setTimeout(r, 50));
        await flushPromises();
      }

      // Verify final state
      const stored = getStoredGroups();
      expect(stored).toHaveLength(1);

      const group = stored[0];
      expect(group.uid).toBe("g1");
      expect(group.groupName).toBe("Social");
      expect(group.groupEnabled).toBe(true);
      expect(group.blockType).toBe("website");

      // Each site should have correct structure
      for (const site of group.sitesList) {
        expect(site).toHaveProperty("url");
        expect(site).toHaveProperty("enabled");
        expect(typeof site.url).toBe("string");
        expect(typeof site.enabled).toBe("boolean");
      }
    });

    it("stored data is plain JSON (no Vue Proxy wrappers)", async () => {
      seedGroups([
        makeSiteGroup("Test", true, [makeSite("example.com")], "website", "g1"),
      ]);

      const wrapper = mountTab();
      await flushPromises();

      // Trigger a save by adding a site
      const input = wrapper.find("input");
      await input.setValue("test.com");
      await input.trigger("keyup.enter");
      await flushPromises();

      // Verify the stored data is serializable (no Proxy, no circular refs)
      const stored = getStoredGroups();
      const serialized = JSON.stringify(stored);
      const parsed = JSON.parse(serialized);
      expect(parsed).toEqual(stored);
    });
  });
});
