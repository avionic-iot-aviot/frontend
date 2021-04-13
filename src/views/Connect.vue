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
            :label="$t('connect.ip')"
            v-model="ip"
            required
            dark
            @keyup.enter.native="submit"
          ></v-text-field>
          <v-text-field
            :label="$t('connect.port')"
            v-model="port"
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
import store from "@/store";

export default {
  components: {
    LocaleSwitch
  },
  data: () => ({
    ip: "192.168.1.12",
    port: "4001",
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
      TokenService.saveToken("ip",this.ip);
      TokenService.saveToken("port",this.port);
      store.commit("status/setConnected", true);
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