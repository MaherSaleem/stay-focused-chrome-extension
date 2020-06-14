<template>
    <div>

        <div class="md-layout">
            <div class="md-layout-item">
                <div v-if="this.lockSettings.password === ''">
                    <p>You haven't set a password yet! go to setting to set it.</p>
                    <md-button class="md-raised md-accent" @click="$emit('unlock')">Go To setting</md-button>
                </div>
                <md-field v-else>
                    <label>Enter Password</label>
                    <md-input @keyup.enter="handleUnlock" v-model="password" type="password"></md-input>
                </md-field>
            </div>
        </div>

        <md-snackbar :md-position="`center`" :md-duration="4000"
                     :md-active.sync="showErrorMessage" md-persistent>
            <span>Wrong Password!</span>
        </md-snackbar>
    </div>
</template>

<script>
    import Tooltip from "../../sharedComponents/Tooltip";

    export default {
        name: "PasswordUnlock",
        components: {Tooltip},
        props: ['lockSettings'],
        data() {
            return {
                password: "",
                showErrorMessage: false,
            }
        },
        methods: {
            handleUnlock() {
                if (this.password.toLowerCase() === this.lockSettings.password.toLowerCase()) {// TODO make trim/to_lower and things like that
                    this.$emit('unlock');
                } else {
                    this.showErrorMessage = true;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>