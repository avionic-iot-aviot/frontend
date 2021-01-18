<template>
  <div>
    <div v-for="item in navigationItems" :key="item.route" :class="{
      navigationItem: true,
      navigationItemSelected: isActive(item.name),
    }">
      <div class="nav-button" v-if="'name' in item" @click="goTo(item.name)">{{item.text}}</div>
      <div class="nav-button" v-if="'callback' in item" @click="item.callback(item)">{{item.text}}</div>
    </div>
  </div>
</template>

<script>
import enums from "@/enums";
import { TokenService } from "@/services/token.service";
import { mapMutations } from "vuex";
import store from "@/store";

export default {
  name: 'Navigation',

  methods: {
    ...mapMutations("snackbar", ["showMessage","closeMessage"]),
    isActive(name) {
      if (!name) return false;
      return this.mapping[this.$route.name] == name;
    },
    goTo(name) {
      this.$router.push({ name }).catch(()=>{});
    }
  },

  computed: {
    enums() {
      return enums;
    }
  },

  data() {
    return {
      mapping: {
        Devices: "Devices",
        About: "About",
      },
      navigationItems: [
        {
          name: "Devices",
          text: this.$t('navigation.devices')
        },
        {
          name: "About",
          text: this.$t('navigation.about')
        },
        {
          callback: async () => {
            TokenService.removeToken("ip");
            TokenService.removeToken("port");
            store.commit("status/setConnected", false);
            this.$router.push({ name: "Connect" }).catch(()=>{});
          },
          text: this.$t('navigation.disconnect')
        }
      ]
    };
  },
};
</script>

<style scoped>
.navigationItem {
  cursor: pointer;
  background-color: #000;
  display: inline-block;
  margin-right: 8px;
}
.navigationItemSelected {
  background-color: #555;
}
.nav-button {
  padding: 4px;
}
</style>