import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Credential from "../views/Home.vue";
import { veridaClient } from "@/helpers/";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Credential,
    meta: {
      requiresAuth: true,
    },
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

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (veridaClient.did) {
      next();
    } else {
      next("/connect");
    }
  } else {
    next();
  }
});

// router.beforeResolve(RouteGuard);

export default router;
