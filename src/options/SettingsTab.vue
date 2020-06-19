<template>
    <div>

        <shared-card>
            <h4>Lock type </h4>
            <p class="note">Note: The idea behind this is to make deactivating the extension needs some time,
                so you might prefer to
                continue working instead of deactivating it.</p>
            <md-radio v-model="settings.lock.type" value="none">None</md-radio>
            <md-radio v-model="settings.lock.type" value="question">Answering a Question</md-radio>
            <md-column v-if="settings.lock.type === 'question'">
                <md-field>
                    <label>Number of tries before showing answer</label>
                    <md-input type="number" min="1"
                              v-model="settings.lock.questionNumberOfTries"></md-input>
                </md-field>
            </md-column>
            <md-radio v-model="settings.lock.type" value="password">Password
                <tooltip>Notice that you have to enter the password each time you go to settings</tooltip>
            </md-radio>
            <md-column v-if="settings.lock.type === 'password'">
                <md-field>
                    <label>Password </label>
                    <md-input type="password"
                              v-model="settings.lock.password"></md-input>
                </md-field>
            </md-column>
            <md-radio v-model="settings.lock.type" value="click-button">Click Button
                <tooltip>This will make you click a button number of times to unlock</tooltip>
            </md-radio>
            <md-column v-if="settings.lock.type === 'click-button'">
                <md-field>
                    <label>Number of clicks to unlock</label>
                    <md-input type="number" min="1" v-model="settings.lock.clickButtonCounts"></md-input>
                </md-field>
            </md-column>
        </shared-card>

        <shared-card>
            <h4>Working Days and Hours
                <tooltip>Specifying working hours, so the websites will be blocked in these days/hours
                </tooltip>

            </h4>
            <p class="note">Note: You have to activate the tool too, to make it works in working hours/days)</p>
            <md-switch v-model="settings.workHours.enableWorkHours"
                       class="md-menu-content-right-end">
                Active?
            </md-switch>


            <div>

                <md-column :width="50">
                    <md-field>
                        <label>Working Days</label>
                        <md-select :disabled="!settings.workHours.enableWorkHours" v-model="settings.workHours.days"
                                   name="working-days" id="working-days" multiple>
                            <md-option value="0">Sunday</md-option>
                            <md-option value="1">Monday</md-option>
                            <md-option value="2">Tuesday</md-option>
                            <md-option value="3">Wednesday</md-option>
                            <md-option value="4">Thursday</md-option>
                            <md-option value="5">Friday</md-option>
                            <md-option value="6">Saturday</md-option>
                        </md-select>
                    </md-field>
                </md-column>
                From:
                <vue-timepicker :disabled="!settings.workHours.enableWorkHours" format="hh:mm A"
                                v-model="settings.workHours.startTime"></vue-timepicker>
                To:
                <vue-timepicker :disabled="!settings.workHours.enableWorkHours" format="hh:mm A"
                                v-model="settings.workHours.endTime"></vue-timepicker>
            </div>
        </shared-card>

        <shared-card>
            <md-switch v-model="settings.allowFunnyGoBackImages"
                       class="md-menu-content-right-end">
                Show funny images to go back to work
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
    import Tooltip from "../sharedComponents/Tooltip";
    import MdColumn from "../sharedComponents/MdColumn";

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
            MdColumn,
            Tooltip,
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
    .note{
        color: #fa6d6d
    }
</style>