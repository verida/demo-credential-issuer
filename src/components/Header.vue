<template>
  <header class="header">
    <div></div>
    <vda-account
      :logo="logo"
      :contextName="contextName"
      @onLogout="onLogout"
      @onConnected="onSuccess"
    />
  </header>
</template>

<script>
import { defineComponent } from "vue";
import { veridaClient } from "@/helpers";
import webWorker from "@/web-workers";

const { VUE_APP_CONTEXT_NAME, VUE_APP_LOGO_URL } = process.env;

export default defineComponent({
  name: "Header",
  props: {
    setStatus: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      isOpened: false,
      contextName: VUE_APP_CONTEXT_NAME,
      logo: VUE_APP_LOGO_URL,
    };
  },
  methods: {
    toggleDropdown() {
      this.isOpened = !this.isOpened;
    },
    async onSuccess(context) {
      await veridaClient.connectVault(context);

      // initialize messaging in a different thread
      webWorker.send(context);
      this.setStatus(veridaClient.connected);
    },
    async onLogout() {
      veridaClient.logout();
      this.$router.push({ name: "Connect" });
    },
  },
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
  padding: 0 2rem;
  background: #ffffff;
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.04);
}
</style>
