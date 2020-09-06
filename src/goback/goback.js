global.browser = require('webextension-polyfill')

import Vue from 'vue'
import App from './App'


import { MdCard } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import VueAnalytics from "vue-analytics";
import {googleAnalyticsId} from "../constants";

Vue.use(MdCard);
Vue.use(VueAnalytics, {
  id: googleAnalyticsId
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
