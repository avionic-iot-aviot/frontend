<template>
  <div>
    <template v-for="item in navigationItems">
      <div :key="item.route" v-if="!('enabled' in item) || item.enabled" :class="{
        navigationItem: true,
        navigationItemSelected: isActive(item.name),
      }">
        <div class="nav-button" v-if="'name' in item" @click="goTo(item)">{{item.text}}</div>
        <div class="nav-button" v-if="'callback' in item" @click="item.callback(item)">{{item.text}}</div>
      </div>
    </template>
  </div>
</template>

<script>
import enums from "@/enums";
import { TokenService } from "@/services/token.service";
import { mapMutations } from "vuex";

export default {
  name: 'Navigation',

  methods: {
    ...mapMutations("snackbar", ["showMessage","closeMessage"]),
    isActive(name) {
      if (!name) return false;
      return this.mapping[this.$route.name] == name;
    },
    goTo(item) {
      this.$router.push({ name: item.name, params: item.params }).catch(()=>{});
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
        VideoRoom: "VideoRoom",
      },
      navigationItems: [
        {
          name: "Devices",
          text: this.$t('navigation.devices'),
        },
        {
          name: "VideoRoom",
          text: this.$t('navigation.videoroom'),
          params: {copter_id: "mavros"}
        },
        {
          callback: async () => {
            TokenService.removeToken("is_connected");
            this.$router.push({ name: "Connect" }).catch(()=>{});
          },
          text: this.$t('navigation.disconnect')
        }
      ]
    };
  },
};
</script>

<style scoped lang="sass">
.navigationItem
  cursor: pointer
  display: inline-block
  margin-right: 8px
  line-height: 16px
.navigationItemSelected
  background-color: var(--v-secondary-base)
  //border-radius: 0.35em
.nav-button
  padding: 10px
</style>