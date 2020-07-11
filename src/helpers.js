import * as defaults from "./defaults";
import {localStorage, setExtensionIcon} from "./chromeApiHelpers";

export const resetChromeStorageData = () => {
    localStorage.set("sitesGroups", defaults.websitesListDefault);
    localStorage.set("settings", defaults.settingsDefault);
    localStorage.set("active", defaults.activeDefault);
}

export const isValidURL = str => {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}
/**
 * @param url {string}
 * @returns {string}
 */
export const getHostNameFromStringUrl = url => {
    let a = document.createElement("a");
    if (!url.startsWith("http")) {
        url = "http://" + url;
    }
    a.href = url;
    let hostName = a.hostname;
    if (hostName.startsWith("www.")) {
        hostName = hostName.substr(4);
    }
    return hostName;
}


/**
 *
 * @param days {string[]}
 * @returns {boolean}
 */
export const isTodayOneOfTheseDays = (days) => {

    let dayIndex = (new Date()).getDay(); // sunday is 0, saturday is 6
    return days.includes(dayIndex.toString());
}

/**
 *
 * @param startTime {string} // format "08:15 AM"
 * @param endTime {string} // format "08:15 AM"
 * @returns {boolean}
 */
export const isCurrentTimeBetweenTwoTimes = (startTime, endTime) => {
    let currentDate = new Date();
    const convertTimeToDate = timeString => {

        let timeAsDate = new Date(currentDate.getTime());
        timeAsDate.setHours(timeString.substring(0, 2));
        timeAsDate.setMinutes(timeString.substring(3, 5));
        timeAsDate.setSeconds(0);
        let isPM = timeString.substring(6, 8) === "PM";
        if (isPM) {
            timeAsDate.setHours(timeAsDate.getHours() + 12);
        }
        return timeAsDate
    }
    let startTimeAsDate = convertTimeToDate(startTime);
    let endTimeAsDate = convertTimeToDate(endTime);

    return startTimeAsDate < currentDate && endTimeAsDate > currentDate
}
export const setIcon = isActive => {
    let iconPath = isActive ? "/icons/icon_48_active.ico" : "/icons/icon_48_inactive.ico";
    setExtensionIcon(iconPath);
}

export const getFlatEnabledListOfWebsites = groupsList =>
    getFlatListOfWebsites(groupsList).filter(site => site.groupEnabled && site.enabled === true);

export const getFlatListOfWebsites = groupsList => {
    let flatList = [];
    groupsList.forEach(siteGroup => {
        flatList.push(...siteGroup.sitesList.map(site => ({...site, groupEnabled: siteGroup.groupEnabled})));
    });
    return flatList
}

export function getUniqueId(numberOfChars = 6) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < numberOfChars; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


export function truncateText(value, charsLength = 30) {
    return value.length <= charsLength ?
        value : value.substring(0, charsLength) + "...";
}

export function regexMatch(stringToTest, regexString) {
    let re = new RegExp(regexString);
    return !!re.test(stringToTest)
}
export function versionCompare(v1, v2, options) {
    let lexicographical = options && options.lexicographical;
    let zeroExtend = options && options.zeroExtend;
    let v1parts = v1.split('.');
    let v2parts = v2.split('.');

    function isValidPart(x) {
        return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
        return NaN;
    }

    if (zeroExtend) {
        while (v1parts.length < v2parts.length) v1parts.push("0");
        while (v2parts.length < v1parts.length) v2parts.push("0");
    }

    if (!lexicographical) {
        v1parts = v1parts.map(Number);
        v2parts = v2parts.map(Number);
    }

    for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length == i) {
            return 1;
        }

        if (v1parts[i] == v2parts[i]) {
            continue;
        } else if (v1parts[i] > v2parts[i]) {
            return 1;
        } else {
            return -1;
        }
    }

    if (v1parts.length != v2parts.length) {
        return -1;
    }

    return 0;
}


