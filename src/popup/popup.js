import Vue from 'vue'
import App from './App'
import store from '../store'


global.browser = require('webextension-polyfill');
Vue.prototype.$browser = global.browser;

import { MdSwitch, MdButton } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
Vue.use(MdSwitch);
Vue.use(MdButton);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  
  render: h => h(App)
})
