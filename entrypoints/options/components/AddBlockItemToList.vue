<script setup lang="ts">
import { ref, computed } from "vue";
import { NInput } from "naive-ui";
import { isValidURL } from "~/utils/helpers";

const props = defineProps<{
  blockType: "website" | "word" | "regex";
}>();

const emit = defineEmits<{
  "add-new-website": [data: { siteUrl: string; blockType: string }];
}>();

const siteUrl = ref("");

const isValidBlockItem = computed(() => {
  if (props.blockType === "website") {
    return isValidURL(siteUrl.value);
  }
  return true;
});

function handleEnterWebsite() {
  if (siteUrl.value !== "" && isValidBlockItem.value) {
    emit("add-new-website", { siteUrl: siteUrl.value, blockType: props.blockType });
    siteUrl.value = "";
  }
}
</script>

<template>
  <div class="enter-website-field">
    <NInput
      v-model:value="siteUrl"
      placeholder="Add a new item to block"
      @keyup.enter="handleEnterWebsite"
      :status="siteUrl !== '' && !isValidBlockItem ? 'error' : undefined"
    />
    <span class="error-text" v-if="siteUrl !== '' && !isValidBlockItem">
      Invalid Website
    </span>
  </div>
</template>

<style scoped>
.enter-website-field {
  margin: 2px auto;
  width: 90%;
}

.error-text {
  margin-left: 5%;
  font-size: smaller;
  color: #ff1744;
}
</style>
