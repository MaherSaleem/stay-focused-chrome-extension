<template>
    <div class="page-container">

        <unlock-page
                v-if="this.isLocked"
                v-on:unlock="handleUnlock"
        />
        <md-app v-else>
            <md-app-toolbar class="md-primary">
                <span class="md-title">Stay Focused</span>
                <div class="md-toolbar-section-end">
                    <md-switch v-model="active" @change="changeActiveStatus">
                        {{active? "Active": "Inactive"}}
                    </md-switch>
                </div>
            </md-app-toolbar>

            <md-app-drawer md-permanent="full">
                <md-toolbar class="md-transparent" md-elevation="0">
                    <span><img src="../images/logo-red.png"></span>
                </md-toolbar>

                <md-list>
                    <md-list-item :class="{'selected-tab': isSelectedTab('websites-tab')}"
                                  @click="selectTab('websites-tab')">
                        <md-icon>move_to_inbox</md-icon>
                        <span class="md-list-item-text">Websites</span>
                    </md-list-item>

                    <md-list-item :class="{'selected-tab': isSelectedTab('settings-tab')}"
                                  @click="selectTab('settings-tab')">
                        <md-icon>settings</md-icon>
                        <span class="md-list-item-text">Settings</span>
                    </md-list-item>

                    <md-list-item :class="{'selected-tab': isSelectedTab('about-tab')}" @click="selectTab('about-tab')">
                        <md-icon>info</md-icon>
                        <span class="md-list-item-text">About</span>
                    </md-list-item>
                </md-list>
            </md-app-drawer>

            <md-app-content>
                <div>
                    <component :is="selectedTab"></component>
                </div>

            </md-app-content>
        </md-app>
    </div>
</template>

<script>
    import SettingsTab from "./SettingsTab";
    import AboutTab from "./AboutTab";
    import WebsitesTab from "./WebsitesTab";
    import {localStorage} from "../chromeApiHelpers";
    import UnlockPage from "./unlock/UnlockPage";

    export default {
        name: "App",
        components: {UnlockPage, AboutTab, SettingsTab, WebsitesTab},

        mounted() {
            localStorage.get("active").then(active => {
                this.active = active;
            });
            localStorage.get("settings").then(settings => {
                this.lockType = settings.lock.type;
                this.isLocked = this.lockType !== 'none'
            });
        },
        data() {
            return {
                selectedTab: "websites-tab",
                active: false,
                lockType: "none",
                isLocked: false,
            }
        },
        methods: {

            /**
             * @param {string} tabName
             */
            selectTab(tabName) {
                this.selectedTab = tabName;
            },
            isSelectedTab(tabName) {
                return this.selectedTab === tabName;
            },
            changeActiveStatus() {
                localStorage.set("active", this.active);
            },
            handleUnlock() {
                this.isLocked = false;
                this.active = false
            }
        }
    };
</script>

<style lang="scss" scoped>


    .md-app {
        border: 1px solid aliceblue;
        height: inherit;

        .md-content {
            background-color: rgb(248, 249, 250);
        }
    }

    .md-drawer {
        width: 15%;
        max-width: calc(100vw - 125px);
    }

    .page-container {
        height: 755px;
    }

    /*/////////////*/
    .selected-tab {
        background-color: #e9e9e9;
    }

</style>
