<template>
    <div>
        <div>
            <md-switch @change="saveSettings" v-model="settings.allowFunnyGoBackImages"
                       class="md-menu-content-right-end">
                Funny images to go back to work?
            </md-switch>

        </div>
        <div>
            <md-switch @change="saveSettings" v-model="settings.workHours.enableWorkHours"
                       class="md-menu-content-right-end">
                Working hours
            </md-switch>
            <div>
                <vue-timepicker @change="saveSettings" :disabled="!settings.workHours.enableWorkHours" format="hh:mm A"
                                v-model="settings.workHours.startTime"></vue-timepicker>
                <vue-timepicker @change="saveSettings" :disabled="!settings.workHours.enableWorkHours" format="hh:mm A"
                                v-model="settings.workHours.endTime"></vue-timepicker>
            </div>
        </div>
        <div>
            <md-button class="md-raised reset-button" @click.native="isResetButtonActive = true">Reset Data</md-button>
        </div>
        <md-dialog-confirm
                :md-active.sync="isResetButtonActive"
                md-title="Are you sure you want to reset the data?"
                md-content="This will make all your settings and websites return to their initial values."
                md-confirm-text="Yes"
                md-cancel-text="No"
                @md-cancel=""
                @md-confirm="onResetConfirm"/>
    </div>
</template>

<script>
    import VueTimepicker from 'vue2-timepicker'
    import 'vue2-timepicker/dist/VueTimepicker.css'

    export default {
        name: "SettingsTab",
        mounted() {
            chrome.storage.local.get("settings", item => {
                if (item.settings) {
                    this.settings = item.settings;
                } else {
                    this.saveSettings();//save default settings
                }
            });

        },
        data() {
            return {
                settings: {
                    workHours: {
                        startTime: "08:00 AM",
                        endTime: "05:00 PM",
                        enableWorkHours: false
                    },
                    allowFunnyGoBackImages: true,
                },
                isResetButtonActive: false,
            }
        },

        methods: {
            saveSettings() {
                chrome.storage.local.set({"settings": this.settings});
            },
            resetList() {
            },
            onResetConfirm() {
                alert("Confirm");
                //TODO fix that
                // this.sitesGroups = this.defultList;
                // this.storeList();
            }

        },
        components: {
            VueTimepicker
        }
    }
</script>

<style scoped>
    .reset-button {
        margin-top: 2%;

    }
</style>