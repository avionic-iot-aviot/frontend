import Vue from "vue";
import VueI18n from "vue-i18n";
import it from "@/lang/it.json";
import en from "@/lang/en.json";

Vue.use(VueI18n);

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || "it",
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "it",
  messages: { it, en }
});
