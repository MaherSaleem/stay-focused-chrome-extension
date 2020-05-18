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
    import {websitesListDefault} from '../defaults'
    export default {
        name: "WebsitesTab",
        mounted() {
            this.loadWebsites();
        },
        data() {
            return {
                defultList: websitesListDefault,
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

            loadWebsites(){
                chrome.storage.local.get("sitesGroups", item => {
                    if (item.sitesGroups) {
                        this.sitesGroups = item.sitesGroups;
                    } else {
                        this.storeWebsites();//initial run for the app will get default data
                    }
                });
            },
            storeWebsites() {
                chrome.storage.local.set({"sitesGroups": this.sitesGroups});
                chrome.storage.local.set({"flatEnabledSites": this.flatEnabledSites});

            },


            addNewSite(groupIndex) {
                let group = this.sitesGroups[groupIndex];
                group.sitesList.push({
                    url: group.newSiteUrl,
                    enabled: true
                });
                group.newSiteUrl = "";
                this.storeWebsites();
            },
            changeGroupStatus(groupIndex) {
                this.storeWebsites();
            },
            addNewGroup() {
                this.sitesGroups.push({
                    groupName: this.newGroupName,
                    sitesList: [],
                    newSiteUrl: "",
                    groupEnabled: true
                });
                this.newGroupName = "";
                this.storeWebsites();
            },
            deleteGroup(groupIndex) {
                this.sitesGroups.splice(groupIndex, 1);
                this.storeWebsites();
            },
            deleteSite(groupIndex, siteIndex) {
                let group = this.sitesGroups[groupIndex];
                group.sitesList.splice(siteIndex, 1);
                this.storeWebsites();
            },
            toggleSiteEnable() {
                this.storeWebsites();
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