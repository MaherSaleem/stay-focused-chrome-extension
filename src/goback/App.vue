<template>
  <card-with-logo>
    <template v-slot:header>
      <div class="md-title">{{ randomImage.text }}</div>
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
        { path: "images/access-blocked-websites.jpg", text: "" },
        { path: "images/angry-monkey.jpg", text: "Go Back to work now!" },
        {
          path: "images/Black-Girl-Wat.jpg",
          text: "WAT are you doing here? Go to work"
        },
        {
          path: "images/troll.jpg",
          text: "you didn't learn your lesson right? Go to work"
        },
        { path: "images/angry-white-monkey.jpg", text: "Goooooo!" },
        {
          path: "images/coffin-dance.jpg",
          text: "Go to work or dance with us!"
        },
        { path: "images/spongebob.jpg", text: "" },
        { path: "images/baby.jpg", text: "" },
        { path: "images/can-you-please-just-go-away.png", text: "" },
        {
          path: "images/we-dont-do-that-here.png",
          text: "When you open a blocked website instead of working."
        },
        {
          path: "images/Surprised-Joey.jpg",
          text: "When I see you trying to open a blocked website"
        },
        {
          path: "images/ross.jpg",
          text:
            "When I see you trying again and again to open a blocked website"
        },
        {
          path: "images/chandler-oh-my-god.jpg",
          text: "when you don't learn the lesson and break your work again"
        },
        {
          path: "images/chandler-laugh.jpg",
          text: "My face when I block a website for you"
        }
      ],

      selectedImageIndex: 0
    };
  },
  computed: {
    randomImage() {
      return this.imagesObjects[this.selectedImageIndex];
    }
  },
  methods: {
    getRandomImage() {
      localStorage.get("settings").then(settings => {
        if (settings.allowFunnyGoBackImages) {
          this.selectedImageIndex = Math.floor(
            Math.random() * this.imagesObjects.length
          );
        }
      });
    }
  }
};
</script>

<style scoped>
#go-back-image {
  width: 95%;
}
</style>
