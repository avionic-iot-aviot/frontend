import { mapMutations } from "vuex";
import enums from "@/enums";
import { AxiosService } from "@/services/axios.service";

export default {
  mixins: [],
  computed: {
    enums() {
      return enums;
    }
  },
  methods: {
    ...mapMutations("snackbar", ["showMessage","closeMessage"]),

    async fetchWithCheck(ip,port) {
      const res=await AxiosService.fetch(ip,port);
      if (res.error) {
        this.showMessage({
          context: enums.TOAST_TYPE.ERROR,
          text: res.error
        });
        return null;
      }
      else {
        return res;
      }
    },
    async updateWithCheck(ip,port,name,mac) {
      const res=await AxiosService.update(ip,port,name,mac);
      if (res.error) {
        this.showMessage({
          context: enums.TOAST_TYPE.ERROR,
          text: res.error
        });
        return null;
      }
      else {
        this.showMessage({
          context: enums.TOAST_TYPE.SUCCESS,
          text: this.$t('toasts.updated')
        });
        return res;
      }
    }
  }
}