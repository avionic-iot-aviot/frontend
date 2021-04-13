import voca from "voca";
import Vue from "vue";
import moment from "moment";

Vue.filter("capitalize", value => voca.capitalize(value));
Vue.filter("trim", value => voca.trim(value));
Vue.filter("titleCase", value => voca.titleCase(value));
Vue.filter("upperCase", value => voca.upperCase(value));
Vue.filter("datetime", value => {
  if (value) {
    return moment(String(value)).format("YYYY/MM/DD HH:mm");
  }
});
Vue.filter("fullDateTime", value => {
  if (value) {
    moment.locale("it");
    return moment(String(value)).format("LLLL");
  }
});
Vue.filter("date", value => {
  if (value) {
    return moment(String(value)).format("YYYY/MM/DD");
  }
});
Vue.filter("fullDate", value => {
  if (value) {
    moment.locale("it");
    return moment(String(value)).format("dddd, D MMMM YYYY");
  }
});