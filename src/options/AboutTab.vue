<template>
  <div>
    <shared-card>
      <h4>About The Extension</h4>
      <p>
        Stay Focused is an open-source Chrome extension designed to block
        distracting websites, such as social media platforms.
      </p>

      <p>
        The concept is simple: you might start working, only to find yourself
        scrolling through social media like Facebook for 30 minutes without
        realizing it. This extension displays a reminder image to help you get
        back to work.
      </p>
    </shared-card>
    <shared-card>
      <h4>Developed By</h4>
      <p>Maher Khdeir</p>
      <a target="_blank" href="https://www.linkedin.com/in/maher-khdeir/"
        >LinkedIn</a
      >
    </shared-card>
    <shared-card>
      <social-media-share />
    </shared-card>
    <shared-card>
      <h4>Interested in contributing?</h4>
      Visit our open-source GitHub repository.
      <a
        target="_blank"
        href="https://github.com/MaherSaleem/stay-focused-chrome-extension"
        >Github Repository</a
      >.
    </shared-card>
  </div>
</template>

<script>
import SharedCard from "../sharedComponents/SharedCard";
import SocialMediaShare from "../sharedComponents/SocialMediaShare";

export default {
  name: "AboutTab",
  components: { SocialMediaShare, SharedCard }
};
</script>

<style lang="scss" scoped>
.shared-card {
  margin-bottom: 1%;
}
</style>
