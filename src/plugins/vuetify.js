import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    icons: {
      iconfont: "mdi"
    },
      options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: "#7389AE",
        secondary: "#1E392A",
        accent: "#dca256",
        error: "#FF895D",
        warning: "#7389AE",
        info: "#71D6A0",
      },
    },
  },
})

export default vuetify;
