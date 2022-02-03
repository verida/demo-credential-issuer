/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createApp } from "vue";
import VueToast from "vue-toast-notification";
import App from "./App.vue";
import router from "./router";
import Account from "@verida/vue-account";
import { createStore } from "vuex";

import "vue-toast-notification/dist/theme-sugar.css";
import "./assets/scss/main.scss";

const app = createApp(App);

const store = createStore({});

app.use(store);
app.use(Account, { store });

app.use(router);

app.use(VueToast, {
  position: "top",
});

app.mount("#app");
