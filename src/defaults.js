export let settingsDefault = {
    workHours: {
        startTime: "08:00 AM",
        endTime: "05:00 PM",
        enableWorkHours: false
    },
    allowFunnyGoBackImages: true,
    lock: {
        type: "none", /*types are: question, password, none*/
        password: "",
        questionNumberOfTries: 3,
    }
};

export let websitesListDefault = [
    {
        groupEnabled: true,
        groupName: "Social Media",
        uid: "a1b1c1",
        sitesList: [
            {url: "facebook.com", enabled: true},
            {url: "twitter.com", enabled: true},
            {url: "instagram.com", enabled: true},
            {url: "linkedin.com", enabled: true}
        ],
    },
    {
        groupEnabled: false,
        uid: "a2b2c2",
        groupName: "Videos Websites",
        sitesList: [
            {url: "youtube.com", enabled: true},
            {url: "netflix.com", enabled: true},
            {url: "dailymotion.com", enabled: true},
        ],
    },
]
export let activeDefault = false
