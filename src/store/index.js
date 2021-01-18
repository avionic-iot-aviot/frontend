import Vue from 'vue'
import Vuex from 'vuex'

import snackbar from "./modules/snackbar";
import status from "./modules/status";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    snackbar,
    status
  }
})
