export let settingsDefault = {
    workHours: {
        startTime: "08:00 AM",
        endTime: "05:00 PM",
        enableWorkHours: false
    },
    allowFunnyGoBackImages: true,
};

export let websitesListDefault = [
    {
        groupEnabled: true,
        groupName: "Social Media",
        sitesList: [
            {url: "facebook.com", enabled: true},
            {url: "twitter.com", enabled: true},
            {url: "instagram.com", enabled: true},
            {url: "linkedin.com", enabled: true}
        ],
        newSiteUrl: ""
    },
    {
        groupEnabled: false,
        groupName: "Videos Websites",
        sitesList: [
            {url: "youtube.com", enabled: true},
            {url: "netflix.com", enabled: true},
            {url: "dailymotion.com", enabled: true},
        ],
        newSiteUrl: ""
    },
]
export let activeDefault = false
