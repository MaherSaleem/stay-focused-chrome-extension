import {versionCompare} from "../helpers";
import {localStorage} from "../chromeApiHelpers";

export const handle103To104Upgrade = (previousVersion, currentVersion) => {

    const addWebsiteAsDefaultBlockType = () => {
        localStorage.get("sitesGroups").then(sitesGroups => {
            let newSitesGroups = sitesGroups.map(sg => {
                sg.sitesList = sg.sitesList.map(site => {
                    return {...site, blockType: "website"};
                });
                return sg;
            });
            localStorage.set("sitesGroups", newSitesGroups);
        });
    }
    //previous version <= 1.0.3 and new version >= 1.0.4
    if (versionCompare(previousVersion, "1.0.3") <= 0 && versionCompare(currentVersion, "1.0.4") >= 0) {
        //add website block type to current data
        addWebsiteAsDefaultBlockType();
    }
}