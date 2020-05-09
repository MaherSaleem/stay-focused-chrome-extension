<template>
    <div class="page-container">
        <md-app>
            <md-app-toolbar class="md-primary">
                <span class="md-title">Stay Focused</span>
                <div class="md-toolbar-section-end">
                    <md-switch  v-model="active" @change="changeActiveStatus">
                        {{active? "Active": "Inactive"}}
                    </md-switch>
                </div>
            </md-app-toolbar>

            <md-app-drawer md-permanent="full">
                <md-toolbar class="md-transparent" md-elevation="0">
                    Stay Focused
                </md-toolbar>

                <md-list>
                    <md-list-item  :class="{'selected-tab': isSelectedTab('websites')}" @click="selectTab('websites')">
                        <md-icon>move_to_inbox</md-icon>
                        <span class="md-list-item-text">Websites</span>
                    </md-list-item>

                    <md-list-item :class="{'selected-tab': isSelectedTab('settings')}" @click="selectTab('settings')">
                        <md-icon>settings</md-icon>
                        <span class="md-list-item-text">Settings</span>
                    </md-list-item>

                    <md-list-item :class="{'selected-tab': isSelectedTab('contribute')}" @click="selectTab('contribute')">
                        <md-icon>build</md-icon>
                        <span class="md-list-item-text">Contribute</span>
                    </md-list-item>
                    <md-list-item :class="{'selected-tab': isSelectedTab('about')}" @click="selectTab('about')">
                        <md-icon>info</md-icon>
                        <span class="md-list-item-text">About</span>
                    </md-list-item>
                </md-list>
            </md-app-drawer>

            <md-app-content>
                <div v-if="isSelectedTab('websites')">
                    <md-field class="add-new-website-field">
                        <label>Type your new Group of websites</label>
                        <md-input @keyup.enter="addNewGroup" v-model="newGroupName"></md-input>
                    </md-field>
                    <div class="sites-groups">
                        <div class="site-group" v-for="(sitesGroup,groupIndex)  in sitesGroups">
                            <md-card>
                                <md-ripple>
                                    <md-card-header class="card-header">
                                        <div class="md-title">{{sitesGroup.groupName}}
                                        </div>
                                        <md-switch class="enable-group-switch md-primary"
                                                   v-model="sitesGroup.groupEnabled"
                                                   @change="changeGroupStatus(groupIndex)">
                                        </md-switch>


                                    </md-card-header>
                                    <md-card-content>
                                        <md-list class="md-dense">
                                            <md-list-item v-for="(site, siteIndex) in sitesGroup.sitesList">
                                                <md-switch  class="md-primary" v-model="site.enabled"
                                                           @change="toggleSiteEnable"><span
                                                        :class="{'website-disabled': !site.enabled}">{{site.url}}</span>
                                                </md-switch>

                                                <md-button class="md-icon-button md-accent">
                                                    <md-icon @click.native="deleteSite(groupIndex, siteIndex)">delete
                                                    </md-icon>
                                                </md-button>
                                            </md-list-item>
                                        </md-list>
                                        <md-field class="enter-website-field">
                                            <label>Type your new website</label>
                                            <md-input @keyup.enter="addNewSite(groupIndex)"
                                                      v-model="sitesGroup.newSiteUrl"></md-input>
                                        </md-field>
                                    </md-card-content>
                                    <md-divider></md-divider>


                                    <md-card-actions class="md-alignment-left">
                                        <md-button @click.native="deleteGroup(groupIndex)" class="md-raised ">
                                            Delete
                                            Group
                                        </md-button>
                                    </md-card-actions>
                                </md-ripple>
                            </md-card>
                        </div>
                    </div>

                </div>
                <div v-if="isSelectedTab('settings')">
                    <settings-tab></settings-tab>
                </div>
                <div v-if="isSelectedTab('contribute')">
                    <contribute-tab></contribute-tab>
                </div>
                <div v-if="isSelectedTab('about')">
                    <about-tab></about-tab>
                </div>

            </md-app-content>
        </md-app>
    </div>
</template>

<script>
    import SettingsTab from "./SettingsTab";
    import AboutTab from "./AboutTab";
    import ContributeTab from "./ContributeTab";

    export default {
        name: "App",
        components: {ContributeTab, AboutTab, SettingsTab},
        mounted() {
            chrome.storage.local.get("active", item => this.active = item.active);
            chrome.storage.local.get("sitesGroups", item => {
                if (item.sitesGroups) {
                    this.sitesGroups = item.sitesGroups;
                } else {

                    this.storeList();//initial run for the app will get default data
                }
            });
        },
        data() {
            return {
                selectedTab: "websites",
                active: false,
                defultList: [
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
                ],
                sitesGroups: [],
                newGroupName: "",
            }
        },
        computed: {
            flatSites() {
                let flatList = [];
                this.sitesGroups.forEach(siteGroup => {
                    if (siteGroup.groupEnabled) {
                        flatList.push(...siteGroup.sitesList)
                    }
                });
                return flatList
            },
            flatEnabledSites() {
                return this.flatSites.filter(site => site.enabled === true);
            }
        },
        methods: {
            addNewSite(groupIndex) {
                let group = this.sitesGroups[groupIndex];
                group.sitesList.push({
                    url: group.newSiteUrl,
                    enabled: true
                });
                group.newSiteUrl = "";
                this.storeList();
            },
            changeGroupStatus(groupIndex) {
                this.storeList();
            },
            addNewGroup() {
                this.sitesGroups.push({
                    groupName: this.newGroupName,
                    sitesList: [],
                    newSiteUrl: "",
                    groupEnabled: true
                });
                this.newGroupName = "";
                this.storeList();
            },
            deleteGroup(groupIndex) {
                this.sitesGroups.splice(groupIndex, 1);
                this.storeList();
            },
            deleteSite(groupIndex, siteIndex) {
                let group = this.sitesGroups[groupIndex];
                group.sitesList.splice(siteIndex, 1);
                this.storeList();
            },
            toggleSiteEnable() {
                this.storeList();
            },
            resetList() {
                this.sitesGroups = this.defultList;
                this.storeList();
            },
            storeList() {
                chrome.storage.local.set({"sitesGroups": this.sitesGroups});
                chrome.storage.local.set({"flatEnabledSites": this.flatEnabledSites});

            },
            changeActiveStatus() {
                chrome.storage.local.set({"active": this.active});
            },

            /**
             * @param {string} tabName
             */
            selectTab(tabName) {
                this.selectedTab = tabName;
            },
            isSelectedTab(tabName){
                return this.selectedTab === tabName;
            }
        },

    };
</script>

<style scoped>


    .md-app {
        border: 1px solid aliceblue;
        height: inherit;
    }

    .md-drawer {
        width: 15%;
        max-width: calc(100vw - 125px);
    }

    .page-container {
        height: 800px;
    }

    /*/////////////*/
    .md-card {
        width: 320px;
        margin: 4px;
        display: inline-block;
        vertical-align: top;
    }

    .card-header {
        display: flex;
    }

    .enable-group-switch {
        margin-left: auto;
        margin-top: 4%;
        margin-bottom: 2%;
    }

    .sites-groups {
        display: flex;
        flex-flow: row wrap;
    }

    .enter-website-field{
        margin: 2px auto;
        width: 90%;
    }

    .md-list {
        overflow-y: auto;
        height: 250px;
    }

    /*.buttons-content {*/
    /*    min-height: 5%*/
    /*}*/

    /*.website-disabled {*/
    /*    text-decoration: line-through;*/
    /*}*/

    .selected-tab{
        background-color: #e9e9e9;
    }
    .add-new-website-field {
        left: 1%;
        width: 26%;
    }
</style>
