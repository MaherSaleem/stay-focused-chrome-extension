<template>
  <block-item-base-tab
    :allow-create-new-groups="false"
    :block-type-to-show="`word`"
    :allow-delete-groups="false"
  >
    <template v-slot:note>
      Note: Avoid using single letters or short words (e.g., 'a'), as this will
      block all websites containing the letter 'a'.
    </template>
  </block-item-base-tab>
</template>

<script>
import BlockItemBaseTab from "./BlockItemBaseTab";

export default {
  name: "BlockByWordTab",
  components: { BlockItemBaseTab }
};
</script>

<style scoped></style>
