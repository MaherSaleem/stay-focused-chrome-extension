import Vue from 'vue'
import App from './App'


global.browser = require('webextension-polyfill');
Vue.prototype.$browser = global.browser;

import {MdSwitch, MdButton, MdCard, MdBadge} from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import VueAnalytics from 'vue-analytics'
import {googleAnalyticsId} from "../constants";

Vue.use(MdSwitch);
Vue.use(MdButton);
Vue.use(MdCard);
Vue.use(MdBadge);

Vue.use(VueAnalytics, {
    id: googleAnalyticsId
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    render: h => h(App)
})
