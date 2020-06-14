import {getSiteGroupStructure, getSiteStructure} from "./dataHelpers/SitesGroup";

export let settingsDefault = {
    workHours: {
        startTime: "08:00 AM",
        endTime: "05:00 PM",
        enableWorkHours: false
    },
    allowFunnyGoBackImages: true,
    lock: {
        type: "none", /*types are: question,click-button, password, none*/
        password: "",
        questionNumberOfTries: 3,
        clickButtonCounts: 5, // how many times the user has to click the button to unlock
    }
};

export let websitesListDefault = [
    getSiteGroupStructure("Social Media", true, [
        getSiteStructure("facebook.com"),
        getSiteStructure("twitter.com"),
        getSiteStructure("instagram.com"),
        getSiteStructure("linkedin.com"),
    ]),
    getSiteGroupStructure("Videos Websites", false, [
        getSiteStructure("youtube.com"),
        getSiteStructure("netflix.com"),
        getSiteStructure("dailymotion.com"),
    ]),
]
export let activeDefault = false
