<template>
  <div class="page-container">
    <md-progress-spinner
      class="loader"
      v-if="loading"
      :md-diameter="100"
      :md-stroke="10"
      md-mode="indeterminate"
    />

    <unlock-page v-else-if="isLocked" v-on:unlock="handleUnlock" />
    <md-app v-else>
      <md-app-toolbar class="md-primary">
        <span class="md-title">Stay Focused</span>
        <div class="md-toolbar-section-end">
          <md-switch v-model="active">
            {{ active ? "Active" : "Inactive" }}
          </md-switch>
        </div>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          <span><img src="../images/logo-red.png"/></span>
        </md-toolbar>

        <md-list>
          <md-list-item
            :class="{ 'selected-tab': isSelectedTab('block-by-website-tab') }"
            @click="selectTab('block-by-website-tab')"
          >
            <md-icon>move_to_inbox</md-icon>
            <span class="md-list-item-text">Block By website</span>
          </md-list-item>
          <md-list-item
            :class="{ 'selected-tab': isSelectedTab('block-by-word-tab') }"
            @click="selectTab('block-by-word-tab')"
          >
            <md-icon>sticky_note_2</md-icon>
            <span class="md-list-item-text">Block By Word</span>
          </md-list-item>
          <md-list-item
            :class="{ 'selected-tab': isSelectedTab('block-by-regex-tab') }"
            @click="selectTab('block-by-regex-tab')"
          >
            <md-icon>spellcheck</md-icon>
            <span class="md-list-item-text">Block By Regex</span>
          </md-list-item>

          <md-list-item
            :class="{ 'selected-tab': isSelectedTab('settings-tab') }"
            @click="selectTab('settings-tab')"
          >
            <md-icon>settings</md-icon>
            <span class="md-list-item-text">Settings</span>
          </md-list-item>

          <md-list-item
            :class="{ 'selected-tab': isSelectedTab('about-tab') }"
            @click="selectTab('about-tab')"
          >
            <md-icon>info</md-icon>
            <span class="md-list-item-text">About</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <div>
          <component @reload-data="loadData" :is="selectedTab"></component>
        </div>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import SettingsTab from "./SettingsTab";
import AboutTab from "./AboutTab";
import BlockByWebsiteTab from "./BlockItemTabs/BlockByWebsiteTab";
import BlockByWordTab from "./BlockItemTabs/BlockByWordTab";
import BlockByRegexTab from "./BlockItemTabs/BlockByRegexTab";
import { localStorage } from "../chromeApiHelpers";
import UnlockPage from "./unlock/UnlockPage";
import SocialMediaShare from "../sharedComponents/SocialMediaShare";

export default {
  name: "App",
  components: {
    SocialMediaShare,
    UnlockPage,
    AboutTab,
    SettingsTab,
    BlockByWebsiteTab,
    BlockByWordTab,
    BlockByRegexTab
  },

  mounted() {
    this.loadData();
    this.loading = false;
  },
  data() {
    return {
      selectedTab: "block-by-website-tab",
      active: false,
      lockType: "none",
      isLocked: false,
      loading: true
    };
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
    handleUnlock() {
      this.isLocked = false;
      this.active = false;
    },
    loadData() {
      localStorage.get("active").then(active => {
        this.active = active;
      });
      localStorage.get("settings").then(settings => {
        this.lockType = settings.lock.type;
        this.isLocked =
          this.lockType !== "none" &&
          (this.active === true || this.lockType === "password");
      });
    }
  },
  computed: {},
  watch: {
    active() {
      localStorage.set("active", this.active);
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
  height: 100%;
}

/*/////////////*/
.selected-tab {
  background-color: #e9e9e9;
}

.loader {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform: -webkit-translate(-50%, -50%);
  transform: -moz-translate(-50%, -50%);
  transform: -ms-translate(-50%, -50%);
}
</style>
