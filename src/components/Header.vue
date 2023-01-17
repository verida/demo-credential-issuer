<template>
  <header class="header">
    <div></div>
    <vda-account
      :logo="veridaConnectLogo"
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
import { config } from "@/config";

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
      contextName: config.veridaContextName,
      veridaConnectLogo: config.veridaConnnectLogo,
    };
  },
  methods: {
    toggleDropdown() {
      this.isOpened = !this.isOpened;
    },
    async onSuccess(context) {
      console.log(context);
      await veridaClient.connectVault(context);

      // initialize messaging in a different thread
      webWorker.send();
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
