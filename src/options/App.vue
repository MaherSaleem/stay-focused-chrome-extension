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
                    <WebsitesTab></WebsitesTab>
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
    import WebsitesTab from "./WebsitesTab";

    export default {
        name: "App",
        components: {ContributeTab, AboutTab, SettingsTab, WebsitesTab},

        mounted() {
            chrome.storage.local.get("active", item => this.active = item.active);
        },
        data(){
            return {
                selectedTab: "websites",
                active: false,
            }
        },
        methods: {

            /**
             * @param {string} tabName
             */
            selectTab(tabName) {
                this.selectedTab = tabName;
            },
            isSelectedTab(tabName){
                return this.selectedTab === tabName;
            },
            changeActiveStatus() {
                chrome.storage.local.set({"active": this.active});
            },
        }
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





    /*.buttons-content {*/
    /*    min-height: 5%*/
    /*}*/

    /*.website-disabled {*/
    /*    text-decoration: line-through;*/
    /*}*/

    .selected-tab{
        background-color: #e9e9e9;
    }

</style>
