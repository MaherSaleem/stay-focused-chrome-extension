<template>
  <div>
    <p>
      Do you like the extension? share it with others!
    </p>
    <div class="social-media-btns">
      <facebook-button
        v-bind="btnTextProp"
        class="share-button--circle share-button--outline"
        :description="description"
        :url="url"
      />
      <twitter-button
        v-bind="btnTextProp"
        class="share-button--circle share-button--outline"
        :description="description"
        :url="url"
      />
      <linkedin-button
        v-bind="btnTextProp"
        class="share-button--circle share-button--outline"
        :description="description"
        :url="url"
      />
    </div>
  </div>
</template>

<script>
import SharedCard from "./SharedCard";
import FacebookButton from "vue-share-buttons/src/components/FacebookButton";
import TwitterButton from "vue-share-buttons/src/components/TwitterButton";
import LinkedinButton from "vue-share-buttons/src/components/LinkedInButton";

export default {
  name: "SocialMediaShare",
  components: {
    SharedCard,
    FacebookButton,
    TwitterButton,
    LinkedinButton
  },
  data() {
    return {
      url:
        "https://chrome.google.com/webstore/detail/stay-focused/nnlgodiccogbpcfnhmclaicljjgfmekd",
      description:
        "Block distracting websites and get funny images to go back to work"
    };
  },
  props: {
    showText: { type: Boolean, default: true }
  },
  computed: {
    btnTextProp() {
      if (this.showText) {
        return {};
      } else {
        return { btnText: "" };
      }
    }
  }
};
</script>

<style scoped>
.social-media-btns {
  margin-top: 5px;
}
</style>
