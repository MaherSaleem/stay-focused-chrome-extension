<script setup lang="ts">
import BlockItemBaseTab from "./BlockItemBaseTab.vue";
</script>

<template>
  <BlockItemBaseTab
    :allow-create-new-groups="false"
    block-type-to-show="regex"
    :allow-delete-groups="false"
  >
    <template #note>
      Note: If you're unfamiliar with Regex (Regular Expressions), you can skip this page.
    </template>
  </BlockItemBaseTab>
</template>
