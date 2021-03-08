<template>
  <v-app>
    <vue-confirm-dialog></vue-confirm-dialog>
    <v-app-bar
      app
      color="primary"
      dark
      v-if="connected"
    >
      <div class="d-flex align-center">
        <h3 class="app-title">AVIOT_FE</h3>
      </div>

      <v-spacer></v-spacer>
      <LocaleSwitch/>
      <Navigation/>
    </v-app-bar>

    <v-main>
      <div class="main-container" fluid>
        <router-view/>
      </div>
      <SnackBar ref="snack" />
    </v-main>
  </v-app>
</template>

<script>
import SnackBar from "./components/SnackBar";
import LocaleSwitch from "./components/LocaleSwitch";
import Navigation from "./Navigation";
import { mapGetters } from "vuex";

export default {
  name: 'App',

  components: {
    SnackBar,
    Navigation,
    LocaleSwitch
  },

  computed: {
    ...mapGetters("status", ["connected"]),
  },

  created() {
    if (!localStorage.locale) localStorage.locale = "en";
    this.$i18n.locale = localStorage.locale;
  },

  data: function() {
    return {
    };
  },
};
</script>

<style>
html {
  overflow-y: hidden !important;
}
.v-main {
  height: 0px;
}
.v-main__wrap {
  overflow-y: scroll;
}
</style>
