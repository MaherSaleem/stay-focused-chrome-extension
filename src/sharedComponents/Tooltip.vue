<template>
      <span>
          <span class="tooltip-icon">{{iconText}}</span>
      <md-tooltip :md-direction="direction" :md-delay="delay">
         <slot/> <!-- the text to be displayed when hovering-->
      </md-tooltip>
    </span>
</template>

<script>
    export default {
        name: "Tooltip",
        props: {
            delay: {
                type: Number,
                default: 100,
            },
            direction: {
                type: String,
                default: 'right', /*left, right, top, bottom*/
            },
            iconText: {
                type: String,
                default: "?"
            }
        },
    }
</script>

<style scoped>
    .tooltip-icon {
        height: 20px;
        min-width: 20px;
        background-color: #f34949db;
        border-radius: 50%;
        display: inline-block;
        text-align: center;
        color: white;
        position: relative;
        left: 2px;
    }
</style>