<template>
  <block-item-base-tab
    :allow-create-new-groups="false"
    :block-type-to-show="`word`"
    :allow-delete-groups="false"
  >
    <template v-slot:note>
      Note: Don't use short words, for example the letter 'a', since this will
      block any site that has letter 'a'
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
