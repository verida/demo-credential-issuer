import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Credential from "../views/Home.vue";
import { veridaClient } from "@/helpers/";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Credential,
  },
  {
    path: "/connect",
    name: "Connect",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/SSOLogin.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

const authenticated = veridaClient.appInitialized();

router.beforeEach((to, from, next) => {
  console.log(authenticated);
  if (to.name !== "Connect" && !authenticated) next({ name: "Connect" });
  else next();
});

export default router;
