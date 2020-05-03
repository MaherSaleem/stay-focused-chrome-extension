<template>
    <div>
        <div v-for="(sitesGroup,groupIndex)  in sitesGroups">
            {{sitesGroup.groupName}}
            <ul>
                <li v-for="(site, siteIndex) in sitesGroup.sitesList">
                    <input type="checkbox" v-model="site.enabled" @click="toggleSiteEnable(groupIndex, siteIndex)">
                    {{site.url}}
                    <button>Delete</button>
                </li>
            </ul>
            <div>
                <input type="text" v-model="sitesGroup.newSiteUrl">
                <button @click="addNewSite(groupIndex)">Add New Site</button>
            </div>
            <hr>

        </div>
        <div>
            <input type="text" v-model="newGroupName">
            <button @click="addNewGroup">Add New Group</button>
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
                    this.storeList()//initial run for the app will get default data
                }
            });
        },
        data() {
            return {
                sitesGroups: [
                    {
                        groupName: "Default Sites",
                        sitesList: [
                            {url: "facebook.com", enabled: true},
                            {url: "twitter.com", enabled: true}
                        ],
                        newSiteUrl: ""
                    },
                    {
                        groupName: "Custom Sites",
                        sitesList: [
                            {url: "ritaj.edu", enabled: true},
                        ],
                        newSiteUrl: ""
                    }
                ],
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
            toggleSiteEnable(groupIndex, siteIndex) {
                let group = this.sitesGroups[groupIndex];
                let site = group.sitesList[siteIndex];
                site.enabled = !site.enabled;
                this.storeList();
            },
            storeList() {
                chrome.storage.local.set({"sitesGroups": this.sitesGroups});
            }
        }
    };
</script>

<style scoped>
    p {
        font-size: 20px;
    }
</style>
