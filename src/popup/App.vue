<template>
    <div>
        <header>
            <img src="../images/logo-red-white.png">
            <span id="settings-page-btn" @click="openOptionsPage"></span>

        </header>
        <main>
            <shared-card>
                <div class="main-row center" v-if="isLocked && active">
                    <p>Focus mode is enabled, and you have set lock mechanism to unlock</p>
                    <md-button id="unlock-btn" class="md-raised md-accent" @click.native="openOptionsPage">Unlock
                    </md-button>
                </div>
                <div class="main-row" v-else>
                    <p><b>Focus Mode enabled?</b></p>
                    <p>
                        <md-switch v-model="active" @change="saveActive"></md-switch>
                    </p>
                </div>
            </shared-card>
            <shared-card v-if="isValidUrl">
                <div class="main-row">
                    <div><b>Website: </b>{{this.websiteName}}</div>
                    <div v-if="!websiteIsAddedBefore">
                        <md-button @click.native="addCurrentWebsite" class="md-raised md-accent">
                            Add Website
                        </md-button>
                    </div>
                    <md-badge v-else
                              class="md-square md-primary" md-content="Already Added"/>

                </div>
            </shared-card>

            <social-media-share :show-text="false" />
        </main>

        <footer></footer>
    </div>
</template>

<script>
    import {getFlatListOfWebsites, getHostNameFromStringUrl, isValidURL, setIcon} from "../helpers";
    import {
        getChromeActiveTab,
        localStorage,
        openChromeNewTab,
    } from "../chromeApiHelpers";
    import SharedCard from "../sharedComponents/SharedCard";
    import {getSiteGroupStructure, getSiteStructure} from "../dataHelpers/SitesGroup";
    import SocialMediaShare from "../sharedComponents/SocialMediaShare";

    export default {
        components: {SocialMediaShare, SharedCard},
        mounted() {
            localStorage.get("active").then(active => {
                this.active = active
            });
            if (this.active) {
                localStorage.get("settings").then(settings => {
                    this.isLocked = settings.lock.type !== 'none'
                });
            }
            this.setWebsiteName();
        },
        data() {
            return {
                active: true,
                websiteName: "",
                isLocked: false,
                websiteIsAddedBefore: false,
            }
        },
        computed: {
            isValidUrl() {
                return isValidURL(this.websiteName);
            }
        },
        methods: {
            openOptionsPage() {
                openChromeNewTab("options/options.html");
            },
            saveActive() {
                localStorage.set("active", this.active);
                setIcon(this.active);
            },
            addCurrentWebsite() {
                localStorage.get("sitesGroups").then(sitesGroups => {

                    let addedFromPopupSiteGroup = sitesGroups.find(sg => sg.uid === "added-from-popup-uid");
                    if (!addedFromPopupSiteGroup){
                        addedFromPopupSiteGroup = getSiteGroupStructure("Added From Popup", true, [], "added-from-popup-uid");
                        sitesGroups.push(addedFromPopupSiteGroup);
                    }
                    addedFromPopupSiteGroup.sitesList = [getSiteStructure(this.websiteName), ...addedFromPopupSiteGroup.sitesList]
                    localStorage.set("sitesGroups", sitesGroups);
                    this.websiteIsAddedBefore = true;
                });
            },
            setWebsiteName() {
                getChromeActiveTab().then(tab => {
                    this.websiteName = getHostNameFromStringUrl(tab.url);
                    //TODO enhance that, localStorage.get("sitesGroups") is used twice
                    localStorage.get("sitesGroups").then(sitesGroups => {
                        this.websiteIsAddedBefore = getFlatListOfWebsites(sitesGroups).some(site => site.url === this.websiteName);
                    });

                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        background: #323232;
        padding: 10px 5%;

        img {
            width: 150px;
            height: 25px;
        }
    }

    #settings-page-btn {
        background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDIwdjIwSDBWMHoiLz48cGF0aCBmaWxsPSIjY2VjZWNlIiBkPSJNMTUuOTUgMTAuNzhjLjAzLS4yNS4wNS0uNTEuMDUtLjc4cy0uMDItLjUzLS4wNi0uNzhsMS42OS0xLjMyYy4xNS0uMTIuMTktLjM0LjEtLjUxbC0xLjYtMi43N2MtLjEtLjE4LS4zMS0uMjQtLjQ5LS4xOGwtMS45OS44Yy0uNDItLjMyLS44Ni0uNTgtMS4zNS0uNzhMMTIgMi4zNGMtLjAzLS4yLS4yLS4zNC0uNC0uMzRIOC40Yy0uMiAwLS4zNi4xNC0uMzkuMzRsLS4zIDIuMTJjLS40OS4yLS45NC40Ny0xLjM1Ljc4bC0xLjk5LS44Yy0uMTgtLjA3LS4zOSAwLS40OS4xOGwtMS42IDIuNzdjLS4xLjE4LS4wNi4zOS4xLjUxbDEuNjkgMS4zMmMtLjA0LjI1LS4wNy41Mi0uMDcuNzhzLjAyLjUzLjA2Ljc4TDIuMzcgMTIuMWMtLjE1LjEyLS4xOS4zNC0uMS41MWwxLjYgMi43N2MuMS4xOC4zMS4yNC40OS4xOGwxLjk5LS44Yy40Mi4zMi44Ni41OCAxLjM1Ljc4bC4zIDIuMTJjLjA0LjIuMi4zNC40LjM0aDMuMmMuMiAwIC4zNy0uMTQuMzktLjM0bC4zLTIuMTJjLjQ5LS4yLjk0LS40NyAxLjM1LS43OGwxLjk5LjhjLjE4LjA3LjM5IDAgLjQ5LS4xOGwxLjYtMi43N2MuMS0uMTguMDYtLjM5LS4xLS41MWwtMS42Ny0xLjMyek0xMCAxM2MtMS42NSAwLTMtMS4zNS0zLTNzMS4zNS0zIDMtMyAzIDEuMzUgMyAzLTEuMzUgMy0zIDN6Ii8+PC9zdmc+);
        background-repeat: no-repeat;
        background-size: cover;
        width: 24px;
        height: 24px;
        cursor: pointer;
    }


    main {
        display: flex;
        padding-left: 5%;
        padding-right: 5%;
        flex-direction: column;
        margin-top: 8px;
        margin-bottom: 8px;

        .md-card {
            margin-top: 8px;
            margin-bottom: 8px;
        }

        .main-row {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            .md-badge {
                margin-right: 5%;
                padding: 4%;
                background-color: #2bbd7e;
                font-size: small;
            }
        }

        .main-row.center {
            justify-content: center;

            #unlock-btn {
                width: 60%;
            }
        }
    }

    button {
        margin: 2%;
    }
</style>
