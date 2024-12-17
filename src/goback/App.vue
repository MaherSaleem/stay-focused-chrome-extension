<template>
  <card-with-logo>
    <template v-slot:header>
      <div class="md-title">{{ $t(randomImage.text) }}</div>
    </template>
    <template v-slot:media>
      <img id="go-back-image" :src="randomImage.path" />
    </template>
  </card-with-logo>
</template>

<script>
import { localStorage } from "../chromeApiHelpers";
import CardWithLogo from "../sharedComponents/CardWithLogo";

export default {
  name: "App",
  components: { CardWithLogo },
  mounted() {
    this.getRandomImage();
  },
  data() {
    return {
      imagesObjects: [
        {
          path: "images/access-blocked-websites.jpg",
          text: "message.images.text1",
        },
        { path: "images/angry-monkey.jpg", text: "message.images.text2" },
        { path: "images/Black-Girl-Wat.jpg", text: "message.images.text3" },
        { path: "images/troll.jpg", text: "message.images.text4" },
        { path: "images/angry-white-monkey.jpg", text: "message.images.text5" },
        { path: "images/coffin-dance.jpg", text: "message.images.text6" },
        { path: "images/spongebob.jpg", text: "message.images.text7" },
        { path: "images/baby.jpg", text: "message.images.text8" },
        {
          path: "images/can-you-please-just-go-away.png",
          text: "message.images.text9",
        },
        {
          path: "images/we-dont-do-that-here.png",
          text: "message.images.text10",
        },
        { path: "images/Surprised-Joey.jpg", text: "message.images.text11" },
        { path: "images/ross.jpg", text: "message.images.text12" },
        {
          path: "images/chandler-oh-my-god.jpg",
          text: "message.images.text13",
        },
        { path: "images/chandler-laugh.jpg", text: "message.images.text14" },
      ],
      selectedImageIndex: 0,
    };
  },
  computed: {
    randomImage() {
      return this.imagesObjects[this.selectedImageIndex];
    },
  },
  methods: {
    getRandomImage() {
      localStorage.get("settings").then((settings) => {
        if (settings.allowFunnyGoBackImages) {
          this.selectedImageIndex = Math.floor(
            Math.random() * this.imagesObjects.length
          );
        }
      });
    },
  },
};
</script>

<style scoped>
#go-back-image {
  width: 95%;
}
</style>
