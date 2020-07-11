<template>
    <div :class="['site-group', sitesGroup.groupEnabled ? '' : 'disabled']">
        <md-card>
                <md-card-header class="card-header">
                    <div class="md-title">{{sitesGroup.groupName}}
                    </div>
                    <md-switch class="enable-group-switch "
                               v-model="sitesGroup.groupEnabled"
                               @change="$emit('store-websites')"
                    >
                    </md-switch>


                </md-card-header>
                <md-card-content>
                    <add-block-item-to-list v-on:add-new-website="data => $emit('add-new-website', data)" />
                    <md-list class="md-dense">
                        <md-list-item v-for="(site, siteIndex) in sitesGroup.sitesList">
                            <md-switch class="md-primary" v-model="site.enabled" @change="$emit('store-websites')">
                            <span :class="{'website-disabled': !site.enabled}">
                                  <tooltip :icon-text="site.blockType.substr(0,2)">
                                    {{getBlockedItemType(site.blockType)}}
                                  </tooltip>
                              <span>
                                  <span>{{truncateSiteUrl(site.url)}}</span>
                                  <md-tooltip>
                                     {{site.url}}
                                  </md-tooltip>
                              </span>
                            </span>
                            </md-switch>
                            <md-button @click.native="$emit('delete-site', siteIndex)" class="md-icon-button md-accent">
                                <md-icon >delete
                                </md-icon>
                            </md-button>
                        </md-list-item>
                    </md-list>
                </md-card-content>
                <md-divider></md-divider>

                <md-card-actions class="md-alignment-right">
                    <md-button @click.native="$emit('delete-sites-group')" class="md-raised ">
                        Delete
                        Group
                    </md-button>
                </md-card-actions>
        </md-card>
    </div>
</template>

<script>
    import {truncateText} from "../helpers";
    import AddBlockItemToList from "./AddBlockItemToList";
    import Tooltip from "../sharedComponents/Tooltip";
    import {blockTypes} from "../constants";
    export default {
        name: "SitesGroup",
        components: {Tooltip, AddBlockItemToList},
        props: ['sitesGroup'],

        computed: {
        },
        methods:
            {
                truncateSiteUrl(siteUrl){
                    return truncateText(siteUrl, 15);
                },
                getBlockedItemType(blockType){
                    return blockTypes[blockType];
                }
            }

    }
</script>

<style lang="scss" scoped>
    .md-card {
        width: 320px;
        margin: 4px;
        display: inline-block;
        vertical-align: top;
        border-radius: 4px;
        .card-header {
            display: flex;
        }

        .md-list {
            overflow-y: auto;
            height: 250px;
        }

        .enable-group-switch {
            margin-left: auto;
            margin-top: 4%;
            margin-bottom: 2%;
        }
    }

    .add-new-website-field {
        left: 1%;
        width: 26%;
    }
    .buttons-content {
        min-height: 5%
    }
    .website-disabled {
        text-decoration: line-through;
        opacity: 0.5;
    }

    .disabled {
        opacity: 0.5;
    }


</style>