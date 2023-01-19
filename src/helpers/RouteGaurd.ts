import { config } from "@/config";
import store from "store";
import {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordNormalized,
} from "vue-router";

export const routeGuard = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  if (
    to.matched.some((record: RouteRecordNormalized) => record.meta.requiresAuth)
  ) {
    const isConnected = store.get(config.veridaContextName);

    if (isConnected) {
      next();
    } else {
      next("/connect");
    }
  } else {
    next();
  }
};
