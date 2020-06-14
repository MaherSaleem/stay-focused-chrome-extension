<template>
    <div>
        <div class="md-layout">
            <div :style="buttonPositionStyle" class="md-layout-item">
                <md-button v-on:keydown.enter.prevent='' class="md-raised md-accent"
                           @click.native="handleClick">{{clicksLeft}} clicks to unlock
                </md-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ClickButtonUnlock",
        props: ['lockSettings'],

        data() {
            return {
                clicksLeft: this.lockSettings.clickButtonCounts,
                buttonPositionStyle: {
                    textAlign: "center",
                },
            }
        },
        methods: {
            handleClick() {
                this.clicksLeft--;
                this.updateButtonPosition();
                if (this.clicksLeft <= 0) {
                    this.$emit('unlock');
                }
            },
            updateButtonPosition() {
                const availablePositions = ['center', 'left', 'right'];
                this.buttonPositionStyle.textAlign = availablePositions[Math.floor(Math.random() * availablePositions.length)]
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>