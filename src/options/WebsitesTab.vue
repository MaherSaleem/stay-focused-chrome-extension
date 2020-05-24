<template>
    <div>
        <md-field class="add-new-website-field">
            <label>Type your new Group of websites</label>
            <md-input @keyup.enter="addNewGroup" v-model="newGroupName"></md-input>
        </md-field>
        <div class="sites-groups">
            <sites-group
                    v-for="(sitesGroup,groupIndex)  in sitesGroups"
                    :key="groupIndex"
                    :sitesGroup="sitesGroup"
                    v-on:store-websites="storeWebsites"
                    v-on:add-new-website="newSiteUrl => {addNewSite(groupIndex, newSiteUrl)}"
                    v-on:delete-sites-group="deleteGroup(groupIndex)"
                    v-on:delete-site="siteIndex => deleteSite(groupIndex, siteIndex)"
            ></sites-group>
        </div>
    </div>
</template>

<script>
    import {websitesListDefault} from '../defaults'
    import SitesGroup from "./SitesGroup";
    import {getHostNameFromStringUrl} from "../helpers";
    import {localStorage} from "../chromeApiHelpers";

    export default {
        name: "WebsitesTab",
        components: {SitesGroup},
        mounted() {
            this.loadWebsites();
        },
        data() {
            return {
                sitesGroups: websitesListDefault,
                newGroupName: "",
            }
        },
        computed: {

        },
        methods: {

            loadWebsites() {
                localStorage.get("sitesGroups").then(sitesGroups => {
                    this.sitesGroups = sitesGroups
                }).catch(() => {
                    this.storeWebsites();//initial run for the app will get default data
                })
            },
            storeWebsites() {
                localStorage.set("sitesGroups", this.sitesGroups)
            },
            addNewSite(groupIndex, siteUrl) {
                siteUrl = getHostNameFromStringUrl(siteUrl);
                let group = this.sitesGroups[groupIndex];
                group.sitesList.push({
                    url: siteUrl,
                    enabled: true
                });
                this.storeWebsites();
            },
            changeGroupStatus(groupIndex) {
                this.storeWebsites();
            },
            addNewGroup() {
                this.sitesGroups.push({
                    groupName: this.newGroupName,
                    sitesList: [],
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
    .sites-groups {
        display: flex;
        flex-flow: row wrap;
    }

</style>