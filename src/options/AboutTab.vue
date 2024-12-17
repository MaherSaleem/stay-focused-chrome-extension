<template>
  <div>
    <shared-card>
      <h4>{{ $t("message.options.aboutTab.title") }}</h4>
      <p>{{ $t("message.options.aboutTab.description1") }}</p>
      <p>{{ $t("message.options.aboutTab.description2") }}</p>
    </shared-card>
    <shared-card>
      <h4>{{ $t("message.options.aboutTab.developedBy") }}</h4>
      <p>Maher Khdeir</p>
      <a target="_blank" href="https://www.linkedin.com/in/maher-khdeir/"
        >LinkedIn</a
      >
    </shared-card>
    <shared-card>
      <buy-me-a-coffee align="left" />
    </shared-card>
    <shared-card>
      <social-media-share />
    </shared-card>
    <shared-card>
      <h4>{{ $t("message.options.aboutTab.contributing") }}</h4>
      {{ $t("message.options.aboutTab.visitGithub") }}
      <a
        target="_blank"
        href="https://github.com/MaherSaleem/stay-focused-chrome-extension"
        >{{ $t("message.options.aboutTab.githubRepo") }}</a
      >.
    </shared-card>
  </div>
</template>

<script>
import SharedCard from "../sharedComponents/SharedCard";
import SocialMediaShare from "../sharedComponents/SocialMediaShare";
import BuyMeACoffee from "../sharedComponents/BuyMeACoffee.vue";

export default {
  name: "AboutTab",
  components: { BuyMeACoffee, SocialMediaShare, SharedCard },
};
</script>

<style lang="scss" scoped>
.shared-card {
  margin-bottom: 1%;
}
</style>
