<template>
    <md-card>
        <md-card-header class="card-header">
            <div id="logo-div"><img alt="logo" src="../images/logo-red.png"></div>
            <slot name="header"></slot>
        </md-card-header>
        <slot name="media"></slot>
        <md-card-content>
            <slot></slot>
        </md-card-content>
    </md-card>
</template>

<script>
    export default {
        name: "CardWithLogo"
    }
</script>

<style lang="scss" scoped>
    .md-card {
        max-width: 40%;
        margin: auto;
        position: relative;
        top: 40px;
        text-align: center;

        .card-header {
            display: flex;
            flex-direction: column;

            #logo-div {
                text-align: left;
                margin-bottom: 1%;
                img {
                    border-radius: inherit;
                    width: 40%;
                    margin-right: inherit;
                    float: none;
                }
            }
        }
    }
</style>