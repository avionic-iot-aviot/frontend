import Vue from 'vue'
import VueRouter from 'vue-router'
import Connect from '../views/Connect.vue'
import DevicesList from '../views/DevicesList.vue'
import VideoRoom from '../views/VideoRoom.vue'
import defineAbilitiesFor from '@/abilities'
import store from "@/store";
import i18n from "@/i18n";

Vue.use(VueRouter)

const routes = [
  {
    path: '/connect',
    name: 'Connect',
    component: Connect
  },
  {
    path: '/devices',
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

  const connected = localStorage.getItem("is_connected");

  if (connected)
    store.commit("status/setConnected", true);
  else
    store.commit("status/setConnected", false);
  
  router.app.$ability(defineAbilitiesFor());

  const publicPages = ["Connect", "Home"];
  const connRequired = !publicPages.includes(to.name);

  if (!connRequired) {
    next();
  } else if (!connected) {
    return next({ name: "Connect" });
  } else if (!router.app.$can("route", to.name)) {
    next("/");
  } else {
    next();
  }
});

export default router
