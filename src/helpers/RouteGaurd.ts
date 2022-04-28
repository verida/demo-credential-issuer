/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import store from "store";

const { VUE_APP_CONTEXT_NAME }: any = process.env;

export const routeGuard = (to: any, from: any, next: any) => {
  if (to.matched.some((record: any) => record.meta.requiresAuth)) {
    const isConnected = store.get(VUE_APP_CONTEXT_NAME);

    if (isConnected) {
      next();
    } else {
      next("/connect");
    }
  } else {
    next();
  }
};
