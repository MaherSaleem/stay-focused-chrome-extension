<template>
    <div>
        <md-field class="enter-website-field">
            <label>Type your new website</label>
            <md-input @keyup.enter="handleEnterWebsite"
                      v-model="newSiteUrl"></md-input>
        </md-field>
        <md-field class="enter-website-field">
            <label>Block Type</label>
            <md-select v-model="blockType">
                <md-option v-for="(blockSiteValue, blockSiteKey) in blockTypes" :value="blockSiteKey">
                    {{blockSiteValue}}
                </md-option>
            </md-select>
        </md-field>
        <span class="md-error" v-if="this.newSiteUrl !== '' && !isValidBlockItem">Invalid Website</span>

    </div>
</template>

<script>
    import {blockTypes} from '../constants'
    import {isValidURL} from "../helpers";

    export default {
        name: "AddBlockItemToList",
        data() {
            return {
                newSiteUrl: "",
                blockType: "website"
            }
        },
        computed: {
            blockTypes() {
                return blockTypes;
            },
            isValidBlockItem() {
                switch (this.blockType) {
                    case "website":
                        return isValidURL(this.newSiteUrl);
                    default:
                        return true;
                }
            },
        },
        methods: {
            handleEnterWebsite() {
                if (this.newSiteUrl !== "" && this.isValidBlockItem) {
                    this.$emit('add-new-website', this.newSiteUrl);
                    this.newSiteUrl = ''
                }
            }
        }
    }
</script>

<style scoped>
    .enter-website-field {
        margin: 2px auto;
        width: 90%;
    }

    .md-error {
        margin-left: 5%;
        font-size: smaller;
        color: #ff1744;
    }
</style>