import Vue from 'vue'
import VueRouter from 'vue-router'
import Connect from '../views/Connect.vue'
import DevicesList from '../views/DevicesList.vue'
import About from '../views/About.vue'
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
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  if (!localStorage.locale) localStorage.locale = "en";
  i18n.locale = localStorage.locale;

  const connected = localStorage.getItem("ip");

  if (connected) store.commit("status/setConnected", true);

  router.app.$ability(defineAbilitiesFor());

  const publicPages = ["Connect", "Home", "About"];
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
