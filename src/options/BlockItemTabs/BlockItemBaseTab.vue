<template>
    <div>
        <div>
            <note-block v-if="hasNote">
                <slot name="note">
                </slot>
            </note-block>
        </div>
        <md-column v-if="allowCreateNewGroups" class="enter-new-group-input" :width="50">
            <md-field class="add-new-website-field">
                <label>Type the name of the new group of websites(ex: E-Commerce)</label>
                <md-input @keyup.enter="addNewGroup" v-model="newGroupName"></md-input>
            </md-field>
        </md-column>

        <div class="sites-groups">
            <sites-group
                    v-for="(sitesGroup,groupIndex)  in toShowSitesGroups"
                    :key="sitesGroup.uid"
                    :sitesGroup="sitesGroup"
                    :allow-delete="allowDeleteGroups"
                    v-on:store-websites="storeWebsites"
                    v-on:add-new-website="siteData => {addNewSite(sitesGroup.uid, siteData)}"
                    v-on:delete-sites-group="deleteGroup(sitesGroup.uid)"
                    v-on:delete-site="siteIndex => deleteSite(sitesGroup.uid, siteIndex)"
            ></sites-group>
        </div>
    </div>
</template>

<script>
    import {websitesListDefault} from '../../defaults'
    import SitesGroup from "./SitesGroup";
    import {getHostNameFromStringUrl} from "../../helpers";
    import {localStorage} from "../../chromeApiHelpers";
    import {getSiteGroupStructure, getSiteStructure} from "../../dataHelpers/SitesGroup";
    import MdColumn from "../../sharedComponents/MdColumn";
    import NoteBlock from "../../sharedComponents/NoteBlock";

    export default {
        name: "BlockItemBaseTab",
        components: {NoteBlock, MdColumn, SitesGroup},
        mounted() {
            this.loadWebsites();
        },
        props: {
            allowCreateNewGroups: {
                type: Boolean,
                default: true,
            },
            blockTypeToShow: {
                type: String,
                required: true
            },
            allowDeleteGroups: {
                type: Boolean,
                default: true
            }

        },
        data() {
            return {
                sitesGroups: websitesListDefault,
                newGroupName: "",
            }
        },
        computed: {
            toShowSitesGroups() {
                return this.sitesGroups.filter(sg => this.blockTypeToShow === sg.blockType);
            },
            hasNote() {
                return !!this.$slots.note;
            }
        },
        methods: {

            findGroupIndexByUid(uid) {
                return this.sitesGroups.findIndex(sg => sg.uid === uid);
            },
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
            addNewSite(groupUid, siteData) {
                let groupIndex = this.findGroupIndexByUid(groupUid);
                let {siteUrl, blockType} = siteData;
                if (blockType === 'website') {//TODO maybe this should be moved to addBlockItemToList
                    siteUrl = getHostNameFromStringUrl(siteUrl);
                }
                let group = this.sitesGroups[groupIndex];
                group.sitesList = [getSiteStructure(siteUrl, true, blockType), ...group.sitesList]
                this.storeWebsites();
            },
            changeGroupStatus(groupIndex) {
                this.storeWebsites();
            },
            addNewGroup() {
                this.sitesGroups = [getSiteGroupStructure(this.newGroupName), ...this.sitesGroups]
                this.newGroupName = "";
                this.storeWebsites();
            },
            deleteGroup(groupUid) {
                let groupIndex = this.findGroupIndexByUid(groupUid);
                this.sitesGroups.splice(groupIndex, 1);
                this.storeWebsites();
            },
            deleteSite(groupUid, siteIndex) {
                let groupIndex = this.findGroupIndexByUid(groupUid);
                //FIXME fix that work around. It was disabling the item below it
                setTimeout(() => {
                    let group = this.sitesGroups[groupIndex];
                    group.sitesList.splice(siteIndex, 1);
                    this.storeWebsites();
                }, 10)
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

    .enter-new-group-input {
        position: relative;
        left: 1%;
    }

</style>