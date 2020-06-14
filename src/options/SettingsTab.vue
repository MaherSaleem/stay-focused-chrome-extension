<template>
    <div>

        <shared-card>
            <md-switch v-model="settings.workHours.enableWorkHours"
                       class="md-menu-content-right-end">
                Working hours
            </md-switch>
            <div>
                <vue-timepicker :disabled="!settings.workHours.enableWorkHours" format="hh:mm A"
                                v-model="settings.workHours.startTime"></vue-timepicker>
                <vue-timepicker :disabled="!settings.workHours.enableWorkHours" format="hh:mm A"
                                v-model="settings.workHours.endTime"></vue-timepicker>
            </div>
        </shared-card>

        <shared-card>
            <h4>Lock Type</h4>
            <md-radio v-model="settings.lock.type" value="none">None</md-radio>
            <md-radio v-model="settings.lock.type" value="question">Question</md-radio>
            <md-field v-if="settings.lock.type === 'question'">
                <label>Number of tries before showing answer</label>
                <md-input type="number" min="1"
                          v-model="settings.lock.questionNumberOfTries"></md-input>
            </md-field>
            <md-radio v-model="settings.lock.type" value="password">Password</md-radio>
            <md-field v-if="settings.lock.type === 'password'">
                <label>Password</label>
                <md-input type="password"
                          v-model="settings.lock.password"></md-input>
            </md-field>
            <md-radio v-model="settings.lock.type" value="click-button">Click Button</md-radio>
            <md-field v-if="settings.lock.type === 'click-button'">
                <label>Number of clicks to unlock</label>
                <md-input type="number" min="1" v-model="settings.lock.clickButtonCounts"></md-input>
            </md-field>
        </shared-card>
        <shared-card>
            <md-switch v-model="settings.allowFunnyGoBackImages"
                       class="md-menu-content-right-end">
                Funny images to go back to work?
            </md-switch>
        </shared-card>
        <shared-card>
            <md-button class="md-raised reset-button" @click.native="isResetButtonActive = true">Reset Data</md-button>
        </shared-card>
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
    import {settingsDefault} from '../defaults';
    import {resetChromeStorageData} from '../helpers';
    import {localStorage} from "../chromeApiHelpers";
    import SharedCard from "../sharedComponents/SharedCard";

    export default {
        name: "SettingsTab",
        mounted() {
            this.loadSettings();
        },
        data() {
            return {
                settings: settingsDefault,
                isResetButtonActive: false,
            }
        },

        methods: {
            loadSettings() {
                localStorage.get("settings")
                    .then(settings => {
                        this.settings = settings;
                    })
                    .catch(e => {
                        this.saveSettings()//save default settings(initially default settings will be in data)
                    })
            },
            saveSettings() {
                localStorage.set("settings", this.settings);
            },
            onResetConfirm() {
                resetChromeStorageData();
                this.loadSettings();
            }

        },
        components: {
            SharedCard,
            VueTimepicker
        },
        watch: {
            settings: {
                handler() {
                    this.saveSettings()
                },
                deep: true
            },
        }
    }
</script>

<style lang="scss" scoped>
    .reset-button {
        margin-top: 2%;
    }

    .time-picker {
        z-index: 6
    }
    .md-radio {
        display: flex;
    }

    .shared-card {
        margin-bottom: 2%;
    }
</style>