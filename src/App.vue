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
        AVIOT_FE
      </div>

      <v-spacer></v-spacer>
      <LocaleSwitch/>
      <Navigation/>
    </v-app-bar>

    <v-main>
      <v-container fluid class="main-container">
        <router-view/>
      </v-container>
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
