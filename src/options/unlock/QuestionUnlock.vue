<template>
    <div>
        <button @click="handleUnlock"> Unlock Question</button>
    </div>
</template>

<script>
    export default {
        name: "QuestionUnlock",
        props: ['lockSettings'],
        methods: {
            handleUnlock() {
                this.$emit('unlock');
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>