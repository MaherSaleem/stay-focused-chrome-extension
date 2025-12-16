<template>
  <div class="container-fluid d-flex flex-column align-items-center min-vh-100 p-3 pt-5">
    <button 
      class="btn position-absolute top-0 end-0 m-3 border-0" 
      :class="theme === 'dark' ? 'text-white' : 'text-dark'"
      @click="toggleTheme"
    >
      {{ theme === 'dark' ? '☀️' : '🌙' }}
    </button>

    <div class="text-center w-100 mt-5" style="max-width: 650px;">
      <div class="mb-4">
        <img :src="theme === 'dark' ? '../images/logo-red-white.png' : '../images/logo-red.png'" alt="logo" style="width: 200px;" />
      </div>

      <h3 class="mb-4 fw-normal text-body">
        {{ randomImage.text }}
      </h3>

      <img id="go-back-image" :src="randomImage.path" class="img-fluid rounded" alt="Go Back" />
    </div>
  </div>
</template>

<script>
import { localStorage } from "../chromeApiHelpers";

const supportedLangs = ['en', 'fr', 'it'];
let langCode = navigator.language.slice(0, 2);
const userLang = supportedLangs.includes(langCode) ? langCode : 'en';

export default {
  name: "App",
  mounted() {
    this.getRandomImage();
    this.loadTheme();
  },
  data() {
    return {
      theme: 'light',
      imagesObjects: [
        {
          path: "images/access-blocked-websites.jpg",
          text: {
            en: "",
            fr: "",
            it: ""
          }
        },
        {
          path: "images/angry-monkey.jpg",
          text: {
            en: "Go Back to work now!",
            fr: "Retourne travailler !",
            it: "Torna al lavoro adesso!"
          }
        },
        {
          path: "images/Black-Girl-Wat.jpg",
          text: {
            en: "WAT are you doing here? Go to work",
            fr: "Qu'est-ce que tu fais ici ? Retourne travailler",
            it: "Cosa stai facendo qui? Torna al lavoro"
          }
        },
        {
          path: "images/troll.jpg",
          text: {
            en: "you didn't learn your lesson right? Go to work",
            fr: "Tu n'as pas retenu la leçon, n'est-ce pas ? Au travail !",
            it: "Non hai imparato la lezione? Torna al lavoro"
          }
        },
        {
          path: "images/angry-white-monkey.jpg",
          text: {
            en: "Goooooo!",
            fr: "Goooooo !",
            it: "Goooooo!"
          }
        },
        {
          path: "images/coffin-dance.jpg",
          text: {
            en: "Go to work or dance with us!",
            fr: "Travaille ou danse avec nous !",
            it: "Lavora o balla con noi!"
          }
        },
        {
          path: "images/spongebob.jpg",
          text: {
            en: "",
            fr: "",
            it: ""
          }
        },
        {
          path: "images/baby.jpg",
          text: {
            en: "",
            fr: "",
            it: ""
          }
        },
        {
          path: "images/can-you-please-just-go-away.png",
          text: {
            en: "",
            fr: "",
            it: ""
          }
        },
        {
          path: "images/we-dont-do-that-here.png",
          text: {
            en: "When you open a blocked website instead of working.",
            fr: "Quand tu ouvres un site bloqué au lieu de travailler.",
            it: "Quando apri un sito bloccato invece di lavorare."
          }
        },
        {
          path: "images/Surprised-Joey.jpg",
          text: {
            en: "When I see you trying to open a blocked website",
            fr: "Quand je te vois essayer d'ouvrir un site bloqué",
            it: "Quando ti vedo provare ad aprire un sito bloccato"
          }
        },
        {
          path: "images/ross.jpg",
          text: {
            en: "When I see you trying again and again to open a blocked website",
            fr: "Quand je te vois essayer encore et encore d'ouvrir un site bloqué",
            it: "Quando ti vedo provare ancora e ancora ad aprire un sito bloccato"
          }
        },
        {
          path: "images/chandler-oh-my-god.jpg",
          text: {
            en: "when you don't learn the lesson and break your work again",
            fr: "Quand tu ne retiens pas la leçon et recommences à ne pas travailler",
            it: "Quando non impari la lezione e rompi di nuovo il tuo lavoro"
          }
        },
        {
          path: "images/chandler-laugh.jpg",
          text: {
            en: "My face when I block a website for you",
            fr: "Ma tête quand je bloque un site pour toi",
            it: "La mia faccia quando blocco un sito per te"
          }
        }
      ],
      selectedImageIndex: 0,
      lang: userLang
    };
  },
  computed: {
    randomImage() {
      const img = this.imagesObjects[this.selectedImageIndex];
      return {
        path: img.path,
        text: img.text[this.lang] || img.text['en'] || ""
      };
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
    },
    loadTheme() {
      localStorage.get("theme")
        .then(theme => {
          this.theme = theme || 'light';
          this.applyTheme();
        })
        .catch(() => {
          this.theme = 'light';
          this.applyTheme();
        });
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      localStorage.set("theme", this.theme);
      this.applyTheme();
    },
    applyTheme() {
      document.documentElement.setAttribute('data-bs-theme', this.theme);
    }
  }
};
</script>

<style>
body, html {
  background-color: transparent !important;
  background: none !important;
}
</style>

<style scoped>
#go-back-image {
  max-width: 100%;
  height: auto;
}
</style>
