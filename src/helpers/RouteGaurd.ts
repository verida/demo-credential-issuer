/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import store from "store";

const { VUE_APP_CONTEXT_NAME } = process.env;

export const routeGuard = (to: any, from: any, next: any) => {
  if (to.matched.some((record: any) => record.meta.requiresAuth)) {
    const profileFromStore = store.get(VUE_APP_CONTEXT_NAME);
    if (profileFromStore) {
      next();
    } else {
      next("/connect");
    }
  } else {
    next();
  }
};
