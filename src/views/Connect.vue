<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <LocaleSwitch/>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <font color="white" size="5">{{ $t('connect.message') }}</font>
    </v-row>

    <v-row align="center" justify="center">
      <v-col cols="12" class="text-center">
        <img :src="require('../assets/ns-logo.png')" width="80" />
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="6">
        <v-form>
          <v-text-field
            label="DBAPP URL"
            v-model="dbapp_url"
            required
            dark
            @keyup.enter.native="submit"
          ></v-text-field>
          <v-text-field
            label="WSS URL"
            v-model="wss_url"
            required
            dark
            @keyup.enter.native="submit"
          ></v-text-field>
          <v-text-field
            label="JANUS URL"
            v-model="janus_url"
            required
            dark
            @keyup.enter.native="submit"
          ></v-text-field>
        </v-form>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <v-btn large :loading="loading" :disabled="loading" @click="submit">
          <font color="secondary">{{$t('buttons.connect')}}</font>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import enums from "@/enums";
import { mapMutations } from "vuex";
import { TokenService } from "@/services/token.service";
import LocaleSwitch from "@/components/LocaleSwitch";

export default {
  components: {
    LocaleSwitch
  },
  data: () => ({
    dbapp_url: "",
    wss_url: "",
    janus_url: "",
    loading: false,
  }),
  methods: {
    ...mapMutations("snackbar", ["showMessage","closeMessage"]),
    goToNext() {
      const startPages = ["Devices"];

      let found = false;
      for (const r of startPages) {
        if (this.$can("route", r)) {
          this.$router.push({ name: r }).catch(()=>{});
          found = true;
          break;
        }
      }
      if (!found) this.$router.push({ name: "default" }).catch(()=>{});
    },
    async submit() {
      TokenService.saveToken("dbapp_url",this.dbapp_url);
      TokenService.saveToken("wss_url",this.wss_url);
      TokenService.saveToken("janus_url",this.janus_url);
      TokenService.saveToken("is_connected",true);
      this.goToNext();
      /*this.showMessage({
        context: enums.TOAST_TYPE.ERROR,
        text: res.error
      });*/
      /*this.$confirm({
        message: "prova",
        button: {
          no: this.$t('confirm.no'),
          yes: this.$t('confirm.yes')
        },
        callback: async confirm => {
          if (confirm) {
          }
        }
      });*/

    }
  },
  computed: {
    enums() {
      return enums;
    }
  }
}
</script>

<style scoped>
.container {
  background: #7389ae;
  width: 50%;
}
</style>