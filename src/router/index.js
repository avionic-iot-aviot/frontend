import Vue from 'vue'
import VueRouter from 'vue-router'
import DevicesList from '../views/DevicesList.vue'
import VideoRoom from '../views/VideoRoom.vue'
import defineAbilitiesFor from '@/abilities'
import i18n from "@/i18n";
import config from "@/config.js"

Vue.use(VueRouter)

const routes = [
  {
    path: '/devices',
    name: 'Devices',
    component: DevicesList
  },
  {
    path: '/',
    name: 'Devices',
    component: DevicesList
  },
  {
    path: '/videoroom/:copter_id',
    name: 'VideoRoom',
    component: VideoRoom
  }
]

const router = new VueRouter({
  //mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  if (!localStorage.locale) localStorage.locale = "en";
  i18n.locale = localStorage.locale;

  // const connected = localStorage.getItem("is_connected");

  const tenantId=config.tenantId ? config.tenantId : window.location.href.split("/")[2].split(".")[0];
  Vue.prototype.$dbapp_url=window.location.protocol+"//"+tenantId+".aviot.it/dbapp";
  Vue.prototype.$wss_url=window.location.protocol+"//"+tenantId+".aviot.it";
  Vue.prototype.$janus_url=window.location.protocol+"//"+tenantId+".aviot.it/janus";

  // if (connected)
  //   store.commit("status/setConnected", true);
  // else
  //   store.commit("status/setConnected", false);
  
  router.app.$ability(defineAbilitiesFor());

  const publicPages = ["Devices","VideoRoom"];
  const connRequired = !publicPages.includes(to.name);

  if (!connRequired) {
    next();
  // } else if (!connected) {
  //   return next({ name: "Connect" });
  } else if (!router.app.$can("route", to.name)) {
    next("/");
  } else {
    next();
  }
});

export default router
