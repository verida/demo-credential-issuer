/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { CONTEXT_NAME } from "@/constants";
import store from "store";

export const routeGuard = (to: any, from: any, next: any) => {
  if (to.matched.some((record: any) => record.meta.requiresAuth)) {
    const isConnected = store.get(CONTEXT_NAME);

    if (isConnected) {
      next();
    } else {
      next("/connect");
    }
  } else {
    next();
  }
};
