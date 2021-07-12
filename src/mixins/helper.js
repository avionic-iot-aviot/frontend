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

    async fetchWithCheck(url) {
      const res=await AxiosService.fetch(url);
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
    async updateWithCheck(url,name,mac) {
      const res=await AxiosService.update(url,name,mac);
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
    },
    split(current_name) {
      let temp=current_name.split("-");
      while (temp.length<3) {
        temp.push("");
      }
      if (temp.length>3) {
        let name=temp.slice(0,temp.length-2).join("-");
        temp=[
          name,
          temp[temp.length-2],
          temp[temp.length-1],
        ];
      }
      return temp;
    },
  }
}