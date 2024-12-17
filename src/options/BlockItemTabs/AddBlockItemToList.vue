<template>
  <div>
    <md-field class="enter-website-field">
      <label>{{ $t("message.blockItems.addNewItem") }}</label>
      <md-input
        @keyup.enter="handleEnterWebsite"
        v-model="siteData.siteUrl"
      ></md-input>
    </md-field>
    <span
      class="md-error"
      v-if="siteData.siteUrl !== '' && !isValidBlockItem"
      >{{ $t("message.blockItems.invalidWebsite") }}</span
    >
  </div>
</template>

<script>
import { blockTypes } from "../../constants";
import { isValidURL } from "../../helpers";

export default {
  name: "AddBlockItemToList",
  data() {
    return {
      siteData: {
        siteUrl: "",
      },
    };
  },
  props: {
    blockType: {
      type: String,
      required: true,
    },
  },
  computed: {
    blockTypes() {
      return blockTypes;
    },
    isValidBlockItem() {
      switch (this.blockType) {
        case "website":
          return isValidURL(this.siteData.siteUrl);
        default:
          return true;
      }
    },
  },
  methods: {
    handleEnterWebsite() {
      if (this.siteData.siteUrl !== "" && this.isValidBlockItem) {
        this.$emit("add-new-website", this.siteData);
        this.siteData.siteUrl = "";
      }
    },
  },
};
</script>

<style scoped>
.enter-website-field {
  margin: 2px auto;
  width: 90%;
}

.md-error {
  margin-left: 5%;
  font-size: smaller;
  color: #ff1744;
}
</style>
