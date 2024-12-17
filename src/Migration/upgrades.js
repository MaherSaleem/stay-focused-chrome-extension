import { versionCompare } from "../helpers";
import { localStorage } from "../chromeApiHelpers";
import { getSiteGroupStructure } from "../dataHelpers/SitesGroup";

export const handle103To104Upgrade = (previousVersion, currentVersion) => {
  const addWebsiteAsDefaultBlockType = () => {
    localStorage.get("sitesGroups").then((sitesGroups) => {
      let newSitesGroups = sitesGroups.map((sg) => {
        sg.blockType = "website";
        return sg;
      });
      newSitesGroups.push(
        getSiteGroupStructure("Blocked By Word", true, [], "word")
      );
      newSitesGroups.push(
        getSiteGroupStructure("Blocked By Regex", true, [], "regex")
      );
      localStorage.set("sitesGroups", newSitesGroups);
    });
  };
  //previous version <= 1.0.3 and new version >= 1.0.4
  if (
    versionCompare(previousVersion, "1.0.3") <= 0 &&
    versionCompare(currentVersion, "1.0.4") >= 0
  ) {
    //add website block type to current data
    addWebsiteAsDefaultBlockType();
  }
};
