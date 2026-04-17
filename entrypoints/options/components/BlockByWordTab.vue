<script setup lang="ts">
import BlockItemBaseTab from "./BlockItemBaseTab.vue";
</script>

<template>
  <BlockItemBaseTab
    :allow-create-new-groups="false"
    block-type-to-show="word"
    :allow-delete-groups="false"
  >
    <template #note>
      Note: Avoid using single letters or short words (e.g., 'a'), as this will block all websites
      containing the letter 'a'.
    </template>
  </BlockItemBaseTab>
</template>
