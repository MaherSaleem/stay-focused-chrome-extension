import {getUniqueId} from "../helpers";


export const getSiteGroupStructure = (groupName = "", enabled = true , siteLists = [], uid = getUniqueId()) => {
    return {
        groupName: groupName,
        sitesList: siteLists,
        uid: uid,
        groupEnabled: enabled
    };
}

export const getSiteStructure = (url = "", enabled = true) => {
    return {
        url,
        enabled
    }
}