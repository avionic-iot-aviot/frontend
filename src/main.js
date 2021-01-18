import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import i18n from "./i18n";
import "./filters";

Vue.config.productionTip = false

import abilitiesPlugin from "./plugins/abilitiesPlugin";
Vue.use(abilitiesPlugin);

import FlagIcon from 'vue-flag-icon'
Vue.use(FlagIcon);

import VueConfirmDialog from "vue-confirm-dialog";
Vue.use(VueConfirmDialog);
Vue.component("vue-confirm-dialog", VueConfirmDialog.default);

import { ValidationProvider, ValidationObserver } from 'vee-validate';
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

import { extend } from 'vee-validate';
extend('required', {
  validate (value) {
    return {
      required: true,
      valid: ['', null, undefined].indexOf(value) === -1
    };
  },
  computesRequired: true
});

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
