import {
  getSiteGroupStructure,
  getSiteStructure,
} from "./dataHelpers/SitesGroup";

export let settingsDefault = {
  workHours: {
    startTime: "08:00 AM",
    endTime: "05:00 PM",
    days: ["1", "2", "3", "4", "5"], // Monday to Thursday
    enableWorkHours: false,
  },
  allowFunnyGoBackImages: true,
  lock: {
    type: "click-button" /*types are: question,click-button, password, none*/,
    password: "",
    questionNumberOfTries: 3,
    clickButtonCounts: 8, // how many times the user has to click the button to unlock
  },
};

export let websitesListDefault = [
  getSiteGroupStructure("message.defaults.socialMediaSites", true, [
    getSiteStructure("facebook.com"),
    getSiteStructure("twitter.com"),
    getSiteStructure("x.com"),
    getSiteStructure("instagram.com"),
    getSiteStructure("linkedin.com"),
  ]),
  getSiteGroupStructure("message.defaults.videoSites", false, [
    getSiteStructure("youtube.com"),
    getSiteStructure("netflix.com"),
    getSiteStructure("dailymotion.com"),
  ]),
  getSiteGroupStructure("message.defaults.blockedByWord", true, [], "word"),
  getSiteGroupStructure("message.defaults.blockedByRegex", true, [], "regex"),
];

export let activeDefault = false;
