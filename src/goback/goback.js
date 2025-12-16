global.browser = require("webextension-polyfill");

import Vue from "vue";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";



/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App)
});
