<template>
    <md-card class="shared-card">
        <md-card-header>
            <slot name="header"></slot>
        </md-card-header>
        <slot name="extra"></slot>
        <md-card-content>
            <slot></slot>
        </md-card-content>
        <md-card-actions>
            <slot name="actions"></slot>
        </md-card-actions>
    </md-card>
</template>

<script>
    export default {
        name: "SharedCard"
    }
</script>

<style lang="scss" scoped>

    .shared-card {
        border-radius: 4px;
    }
</style>