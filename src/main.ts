import { createApp } from "vue";
import VueToast from "vue-toast-notification";
import App from "./App.vue";
import router from "./router";

import "vue-toast-notification/dist/theme-sugar.css";
import "./assets/scss/main.scss";

createApp(App)
  .use(router)
  .use(VueToast, {
    position: "top",
  })
  .mount("#app");
