<template>
    <div class="site-group" >
        <md-card>
            <md-ripple>
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
                            <md-switch  class="md-primary"
                                        v-model="site.enabled"
                                        @change="$emit('store-websites')"
                            >
                                <span
                                    :class="{'website-disabled': !site.enabled}">{{site.url}}</span>
                            </md-switch>
                            <md-button class="md-icon-button md-accent">
                                <md-icon @click.native="$emit('delete-site', siteIndex)">delete
                                </md-icon>
                            </md-button>
                        </md-list-item>
                    </md-list>
                    <md-field class="enter-website-field">
                        <label>Type your new website</label>
                        <md-input @keyup.enter="() => {$emit('add-new-website', newSiteUrl); newSiteUrl = ''}"
                                  v-model="newSiteUrl"></md-input>
                    </md-field>
                </md-card-content>
                <md-divider></md-divider>

                <md-card-actions class="md-alignment-left">
                    <md-button @click.native="$emit('delete-sites-group')" class="md-raised ">
                        Delete
                        Group
                    </md-button>
                </md-card-actions>
            </md-ripple>
        </md-card>
    </div>
</template>

<script>
    export default {
        name: "SitesGroup",
        props: ['sitesGroup'],
        data(){
            return{
                newSiteUrl: "",
            }
        }

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
    .buttons-content {
        min-height: 5%
    }
    .website-disabled {
        text-decoration: line-through;
    }

</style>