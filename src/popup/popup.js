import Vue from "vue";
import App from "./App";

global.browser = require("webextension-polyfill");
Vue.prototype.$browser = global.browser;

import {
  MdSwitch,
  MdButton,
  MdCard,
  MdBadge,
} from "vue-material/dist/components";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";

import i18n from "../i18n.js";

Vue.use(MdSwitch);
Vue.use(MdButton);
Vue.use(MdCard);
Vue.use(MdBadge);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: (h) => h(App),
  i18n,
});
