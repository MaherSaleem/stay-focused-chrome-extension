<template>
    <div>

        <md-field>
            <label>Enter Password</label>
            <md-input @keyup.enter="handleUnlock" v-model="password" type="password"></md-input>
        </md-field>
        <md-button @click="handleUnlock">Unlock</md-button>
        <md-snackbar :md-position="`center`" :md-duration="4000"
                     :md-active.sync="showSnackbar" md-persistent>
            <span>Wrong Password!</span>
        </md-snackbar>
    </div>
</template>

<script>
    export default {
        name: "PasswordUnlock",
        props: ['lockSettings'],
        data() {
            return {
                password: "",
                showSnackbar: false,
            }
        },
        methods: {
            handleUnlock() {
                if (this.password === this.lockSettings.password) {// TODO make trim/to_lower and things like that
                    this.$emit('unlock');
                } else {
                    this.showSnackbar = true;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>