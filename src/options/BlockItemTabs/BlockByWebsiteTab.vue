<template>
  <block-item-base-tab
    :allow-create-new-groups="true"
    :block-type-to-show="`website`"
  />
</template>

<script>
import BlockItemBaseTab from "./BlockItemBaseTab";

export default {
  name: "BlockByWebsiteTab",
  components: { BlockItemBaseTab }
};
</script>

<style scoped></style>
