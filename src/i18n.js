import Vue from "vue";
import VueI18n from "vue-i18n";

import en from "./locales/en.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import it from "./locales/it.json";
import tr from "./locales/tr.json";

Vue.use(VueI18n);

const messages = {
  en,
  de,
  fr,
  es,
  it,
  tr,
};

const savedLocale = localStorage.getItem("language") || "en";

const i18n = new VueI18n({
  locale: savedLocale,
  fallbackLocale: "en",
  messages,
});

// Watch for changes in the locale
i18n.watchLocale = () => {
  i18n._vm.$watch("locale", (newLocale) => {
    localStorage.setItem("language", newLocale);
  });
};

i18n.watchLocale();

export default i18n;
