<template>

    <card-with-logo>
            <component
                    v-if="this.lockSettings.type"
                    v-on:unlock="handleUnlock"
                    :lock-settings="lockSettings"
                    :is="lockComponentName"
            />
    </card-with-logo>

</template>

<script>

    import {localStorage} from "../../chromeApiHelpers";
    import QuestionUnlock from "./QuestionUnlock";
    import PasswordUnlock from "./PasswordUnlock";
    import CardWithLogo from "../../sharedComponents/CardWithLogo";
    import ClickButtonUnlock from "./ClickButtonUnlock";

    export default {
        name: "UnlockPage",
        components: {CardWithLogo, PasswordUnlock, QuestionUnlock, ClickButtonUnlock},
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
                localStorage.set("active", false);
                this.$emit('unlock');
            }
        },
        computed: {
            lockComponentName() {
                console.log(this.lockSettings);
                return this.lockSettings.type + "-unlock"
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>