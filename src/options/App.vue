<template>
    <div>
        <button @click="resetList">Reset Data</button>
        <div>
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
                                                   @change="toggleSiteEnable">{{site.url}}
                                        </md-switch>

                                        <md-button class="md-icon-button md-accent">
                                            <md-icon @click.native="deleteSite(groupIndex, siteIndex)">delete</md-icon>
                                        </md-button>
                                    </md-list-item>
                                    <md-divider></md-divider>
                                    <md-list-item>
                                        <md-field>
                                            <label>Type your new website</label>
                                            <md-input v-model="sitesGroup.newSiteUrl"></md-input>
                                        </md-field>
                                        <md-button @click.native="addNewSite(groupIndex)">Add</md-button>

                                    </md-list-item>
                                </md-list>
                            </md-card-content>

                            <md-card-actions>
                                <md-button @click.native="deleteGroup(groupIndex)" class="md-raised md-accent">Delete
                                    Group
                                </md-button>
                            </md-card-actions>
                        </md-ripple>
                    </md-card>
                </div>

            </div>

        </div>
        <div>
            <input type="text" v-model="newGroupName">
            <button @click="addNewGroup">Add New Group</button>
        </div>
        <div>
            <h3>Struture</h3>
            <ul>
                {{sitesGroups}}
            </ul>

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
                        groupName: "Socail Media",
                        sitesList: [
                            {url: "facebook.com", enabled: true},
                            {url: "twitter.com", enabled: true},
                            {url: "instagram.com", enabled: true},
                            {url: "linkedin.com", enabled: true}
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
    p {
        font-size: 20px;
    }

    .md-card {
        width: 320px;
        margin: 4px;
        display: inline-block;
        vertical-align: top;
    }

</style>
