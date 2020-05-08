global.browser = require('webextension-polyfill');
import store from './store'

// alert(`Hello ${store.getters.foo}!`);


/**
 *
 * @param link {string}
 * @returns {string}
 */
const normalizeLink = link => {
    return link;// TODO implement that
}

/**
 *
 * @param startTime {string} // format "08:15 AM"
 * @param endTime {string} // format "08:15 AM"
 * @returns {boolean}
 */
const isCurrentTimeBetweenTwoTimes = (startTime, endTime) => {

    console.log(startTime, endTime);
    var currentDate = new Date();
    const convertTimeToDate = timeString => {

        var timeAsDate = new Date(currentDate.getTime());
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

    console.log(startTimeAsDate, endTimeAsDate, currentDate, startTimeAsDate < currentDate && endTimeAsDate > currentDate);
    return startTimeAsDate < currentDate && endTimeAsDate > currentDate
}


const checkIfCanEnterWebsite = info => {
    chrome.storage.local.get("active", activeItem => {
        let isActive = activeItem.active;
        if (isActive) {
            chrome.storage.local.get("settings", settingsItem => {
                let settings = settingsItem.settings;
                if (settings.workHours && settings.workHours.enableWorkHours === true) {
                    isActive = isActive && isCurrentTimeBetweenTwoTimes(settings.workHours.startTime, settings.workHours.endTime);
                }
                if (isActive) {
                    chrome.storage.local.get("flatEnabledSites", item => {
                        let blockedWebsites = item.flatEnabledSites;
                        var mustGoBack = blockedWebsites.some(website => normalizeLink(info.url).includes(normalizeLink(website.url)));
                        if (info.frameId === 0 && mustGoBack) {
                            chrome.tabs.update(info.tabId, {"url": "goback/goback.html"});
                        }
                    });
                }
            });
        }
    });
};

chrome.webNavigation.onCommitted.addListener(checkIfCanEnterWebsite);
