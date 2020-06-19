<template>
    <div class="md-layout md-gutter">
        <div :class="[ 'md-layout-item', 'md-size-'+width]">
            <slot/>
        </div>
    </div>

</template>

<script>
    export default {
        name: "MdColumn",
        props: {
            width: {
                type: Number,
                default: 30,
            },
        }
    }
</script>

<style scoped>

</style>