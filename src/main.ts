/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createApp } from "vue";
import VueToast from "vue-toast-notification";
import App from "./App.vue";
import router from "./router";
import Account from "@verida/vue-account";

import "vue-toast-notification/dist/theme-sugar.css";
import "./assets/scss/main.scss";

const app = createApp(App);

app.use(Account as any);

app.use(router);

app.use(VueToast, {
  position: "top",
});

app.mount("#app");
