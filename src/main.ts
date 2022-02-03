/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createApp } from "vue";
import VueToast from "vue-toast-notification";
import App from "./App.vue";
import router from "./router";
import Account from "@verida/vue-account3";
import { createStore } from "vuex";

import "vue-toast-notification/dist/theme-sugar.css";
import "./assets/scss/main.scss";

const app = createApp(App);

const store = createStore({
  state() {
    return {
      connected: false,
    };
  },
  mutations: {
    setStatus(state: any) {
      state.connected = !state.connected;
    },
  },
});

app.use(store);
app.use(Account, { store });

app.use(router);
//@ts-ignore
router.app = app;

app.use(VueToast, {
  position: "top",
});

app.mount("#app");
