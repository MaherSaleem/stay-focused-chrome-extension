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
                            <md-switch>
                                Active
                            </md-switch>
                        </div>
                    </div>

                    <div class="md-toolbar-row">
                        <md-tabs class="md-primary">
                            <md-tab id="tab-home" md-label="Websites"></md-tab>
                            <md-tab id="tab-pages" md-label="Settings"></md-tab>
                        </md-tabs>
                    </div>
                </md-app-toolbar>


                <md-app-content class="buttons-content">
                    <md-button class="md-raised" @click.native="resetList">Reset Data</md-button>
                    <md-field>
                        <label>Type your new Group of websites</label>
                        <md-input @keyup.enter="addNewGroup" v-model="newGroupName"></md-input>
                    </md-field>

                </md-app-content>
                <md-app-content>
                    <div class="md-layout">
                        <div class="md-layout-item" v-for="(sitesGroup,groupIndex)  in sitesGroups">
                            <md-card>
                                <md-ripple>
                                    <md-card-header>
                                        <div class="md-title">{{sitesGroup.groupName}}</div>
                                    </md-card-header>
                                    <md-card-content>
                                        <md-list class="md-dense">
                                            <md-list-item v-for="(site, siteIndex) in sitesGroup.sitesList">
                                                <md-switch v-model="site.enabled"
                                                           @change="toggleSiteEnable"><span :class="{'website-disabled': !site.enabled}">{{site.url}}</span>
                                                </md-switch>

                                                <md-button class="md-icon-button md-accent">
                                                    <md-icon @click.native="deleteSite(groupIndex, siteIndex)">delete
                                                    </md-icon>
                                                </md-button>
                                            </md-list-item>
                                            <md-divider></md-divider>
                                            <md-list-item>
                                                <md-field>
                                                    <label>Type your new website</label>
                                                    <md-input @keyup.enter="addNewSite(groupIndex)" v-model="sitesGroup.newSiteUrl"></md-input>
                                                </md-field>

                                            </md-list-item>
                                        </md-list>
                                    </md-card-content>

                                    <md-card-actions>
                                        <md-button @click.native="deleteGroup(groupIndex)" class="md-raised md-accent">
                                            Delete
                                            Group
                                        </md-button>
                                    </md-card-actions>
                                </md-ripple>
                            </md-card>
                        </div>

                    </div>

                </md-app-content>
            </md-app>
        </div>
        <div>
            <div>
            </div>
            <div>
                <h3>Struture</h3>
                <ul>
                    {{sitesGroups}}
                </ul>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "App",
        mounted() {
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
                defultList: [
                    {
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
                    flatList.push(...siteGroup.sitesList)
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
            addNewGroup() {
                this.sitesGroups.push({
                    groupName: this.newGroupName,
                    sitesList: [],
                    newSiteUrl: ""
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
    .page-container{
        width: 70%;
        margin-left: 15%;
    }
    .buttons-content{
        min-height: 5%
    }
    .website-disabled{
        text-decoration: line-through;
    }

</style>
