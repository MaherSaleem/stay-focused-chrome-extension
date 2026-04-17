import { versionCompare } from "./helpers";
import { storage } from "./storage";
import { makeSiteGroup } from "./defaults";
import type { SiteGroup } from "./types";

export async function handle103To104Upgrade(
  previousVersion: string,
  currentVersion: string,
): Promise<void> {
  if (
    versionCompare(previousVersion, "1.0.3") <= 0 &&
    versionCompare(currentVersion, "1.0.4") >= 0
  ) {
    const sitesGroups = await storage.get<SiteGroup[]>("sitesGroups");
    const newSitesGroups = sitesGroups.map((sg) => ({
      ...sg,
      blockType: sg.blockType ?? ("website" as const),
    }));
    newSitesGroups.push(makeSiteGroup("Blocked By Word", true, [], "word"));
    newSitesGroups.push(makeSiteGroup("Blocked By Regex", true, [], "regex"));
    await storage.set("sitesGroups", newSitesGroups);
  }
}
