import Vue from 'vue'
import VueRouter from 'vue-router'
import DevicesList from '../views/DevicesList.vue'
import Drone from '../views/Drone.vue'
import Controller from '../views/Controller.vue'
import Tetracam from '../views/Tetracam.vue'
import defineAbilitiesFor from '@/abilities'
import i18n from "@/i18n";

Vue.use(VueRouter)

const routes = [
  {
    path: '/devices',
    name: 'Devices',
    component: DevicesList
  },
  {
    path: '/',
    name: 'Home',
    component: DevicesList
  },
  {
    path: '/drones',
    name: 'Drone',
    component: Drone,
  },
  {
    path: '/sensors',
    name: 'Controller',
    component: Controller
  },
  {
    path: '/tetracam',
    name: 'Tetracam',
    component: Tetracam
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
