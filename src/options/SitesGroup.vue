<template>
    <div :class="['site-group', sitesGroup.groupEnabled ? '' : 'disabled']">
        <md-card>
                <md-card-header class="card-header">
                    <div class="md-title">{{sitesGroup.groupName}}
                    </div>
                    <md-switch class="enable-group-switch md-primary"
                               v-model="sitesGroup.groupEnabled"
                               @change="$emit('store-websites')"
                    >
                    </md-switch>


                </md-card-header>
                <md-card-content>
                    <md-list class="md-dense">
                        <md-list-item v-for="(site, siteIndex) in sitesGroup.sitesList">
                            <md-switch class="md-primary"
                                       v-model="site.enabled"
                                       @change="$emit('store-websites')"
                            >
                            <span :class="{'website-disabled': !site.enabled}">
                              <span>
                                  <span>{{truncateSiteUrl(site.url)}}</span>
                                  <md-tooltip>
                                     {{site.url}}
                                  </md-tooltip>
                              </span>
                            </span>
                            </md-switch>
                            <md-button class="md-icon-button md-accent">
                                <md-icon @click.native="$emit('delete-site', siteIndex)">delete
                                </md-icon>
                            </md-button>
                        </md-list-item>
                    </md-list>
                    <md-field class="enter-website-field">
                        <label>Type your new website</label>
                        <md-input @keyup.enter="handleEnterWebsite"
                                  v-model="newSiteUrl"></md-input>
                    </md-field>
                    <span class="md-error" v-if="this.newSiteUrl !== '' && !isValidNewSiteUrl">Invalid Website</span>
                </md-card-content>
                <md-divider></md-divider>

                <md-card-actions class="md-alignment-left">
                    <md-button @click.native="$emit('delete-sites-group')" class="md-raised ">
                        Delete
                        Group
                    </md-button>
                </md-card-actions>
        </md-card>
    </div>
</template>

<script>
    import {isValidURL, truncateText} from "../helpers";

    export default {
        name: "SitesGroup",
        props: ['sitesGroup'],
        data() {
            return {
                newSiteUrl: "",
            }
        },
        computed: {
            isValidNewSiteUrl(){
                return isValidURL(this.newSiteUrl);
            }
        },
        methods:
            {
                handleEnterWebsite() {
                    if (this.newSiteUrl !== "" && this.isValidNewSiteUrl) {
                        this.$emit('add-new-website', this.newSiteUrl);
                        this.newSiteUrl = ''
                    }
                },
                truncateSiteUrl(siteUrl){
                    return truncateText(siteUrl, 15);
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


    .enter-website-field {
        margin: 2px auto;
        width: 90%;
    }

    .add-new-website-field {
        left: 1%;
        width: 26%;
    }
    .buttons-content {
        min-height: 5%
    }

    .md-error {
        margin-left: 5%;
        font-size: smaller;
        color: #ff1744;
    }

    .website-disabled {
        text-decoration: line-through;
        opacity: 0.5;
    }

    .disabled {
        opacity: 0.5;
    }

</style>