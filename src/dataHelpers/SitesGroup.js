import {getUniqueId} from "../helpers";


export const getSiteGroupStructure = (groupName = "", enabled = true, siteLists = [], blockType = 'website', uid = getUniqueId()) => {
    return {
        groupName: groupName,
        sitesList: siteLists,
        uid: uid,
        groupEnabled: enabled,
        blockType
    };
}

export const getSiteStructure = (url = "", enabled = true) => {
    return {
        url,
        enabled,
    }
}