<template>
    <div>
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
</template>

<script>
    export default {
        name: "WebsitesTab",
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
        },
    }
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
    .enter-website-field{
        margin: 2px auto;
        width: 90%;
    }

    .md-list {
        overflow-y: auto;
        height: 250px;
    }
    .add-new-website-field {
        left: 1%;
        width: 26%;
    }

</style>