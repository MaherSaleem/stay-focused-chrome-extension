<template>
    <div>
        <div class="page-container">
            <md-app md-waterfall md-mode="fixed-last">
                <md-app-toolbar class="md-large md-dense md-primary">
                    <div class="md-toolbar-row">
                        <div class="md-toolbar-section-start">
                            <span class="md-title">Stay Focused</span>
                        </div>
                        <div class="md-toolbar-section-end">
                            <md-switch  v-model="active" @change="changeActiveStatus">
                                Active
                            </md-switch>
                        </div>
                    </div>

                    <div class="md-toolbar-row">
                        <md-tabs class="md-primary" @md-changed="newSelectedTab => selectedTab = newSelectedTab">
                            <md-tab id="tab-websites" md-label="Websites"></md-tab>
                            <md-tab id="tab-settings" md-label="Settings"></md-tab>
                        </md-tabs>
                    </div>
                </md-app-toolbar>


                <md-app-content v-if="selectedTab === 'tab-websites'">
                    <md-button class="md-raised" @click.native="resetList">Reset Data</md-button>
                    <md-field>
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
                                        <md-switch class="enable-group-switch"
                                                   v-model="sitesGroup.groupEnabled"
                                                   @change="changeGroupStatus(groupIndex)">
                                        </md-switch>


                                    </md-card-header>
                                    <md-card-content>
                                        <md-list class="md-dense">
                                            <md-list-item v-for="(site, siteIndex) in sitesGroup.sitesList">
                                                <md-switch v-model="site.enabled"
                                                           @change="toggleSiteEnable"><span
                                                        :class="{'website-disabled': !site.enabled}">{{site.url}}</span>
                                                </md-switch>

                                                <md-button class="md-icon-button md-accent">
                                                    <md-icon @click.native="deleteSite(groupIndex, siteIndex)">delete
                                                    </md-icon>
                                                </md-button>
                                            </md-list-item>
                                            <md-divider></md-divider>
                                        </md-list>
                                    </md-card-content>

                                    <md-field>
                                        <label>Type your new website</label>
                                        <md-input @keyup.enter="addNewSite(groupIndex)"
                                                  v-model="sitesGroup.newSiteUrl"></md-input>
                                    </md-field>

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

                </md-app-content>
                <md-app-content v-if="selectedTab === 'tab-settings'">
                    <settings-tab></settings-tab>
                </md-app-content>
            </md-app>
        </div>
        <div>
            <div>
            </div>
            <div>
                <h3>Struture</h3>
                <ul>
                    {{flatEnabledSites}}
                </ul>

            </div>
        </div>
    </div>
</template>

<script>
    import SettingsTab from "./SettingsTab";

    export default {
        name: "App",
        components: {SettingsTab},
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
                selectedTab: "tab-websites",
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
            }
        },
    };
</script>

<style scoped>
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

    .page-container {
        display: flex;
        width: 50%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: auto;
    }

    .md-card-content {
        overflow-y: auto;
        height: 250px;
    }

    .buttons-content {
        min-height: 5%
    }

    .website-disabled {
        text-decoration: line-through;
    }

</style>
