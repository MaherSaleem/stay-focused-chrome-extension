<template>
    <div>
        <component
                v-on:unlock="handleUnlock"
                :lock-settings="lockSettings"
                :is="lockComponentName"
        />

    </div>
</template>

<script>

    import {localStorage} from "../../chromeApiHelpers";
    import QuestionUnlock from "./QuestionUnlock";
    import PasswordUnlock from "./PasswordUnlock";

    export default {
        name: "UnlockPage",
        components: {PasswordUnlock, QuestionUnlock},
        data() {
            return {
                lockSettings: {}
            }
        },
        mounted() {
            localStorage.get("settings").then(settings => {
                this.lockSettings = settings.lock;
            });
        },
        methods: {
            handleUnlock() {
                this.$emit('unlock');
            }
        },
        computed: {
            lockComponentName() {
                return this.lockSettings.type + "-unlock"
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>