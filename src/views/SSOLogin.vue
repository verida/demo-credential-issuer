<template>
  <pulse-loader
    class="loader"
    v-if="isLoading"
    color="#000"
    :loading="isLoading"
  />
  <vda-login
    v-else
    @onError="onError"
    @onConnected="onSuccess"
    :contextName="contextName"
    :logo="veridaConnnectLogo"
    :loginText="loginText"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { veridaClient } from "@/helpers/";
import { config } from "@/config";
import webWorker from "@/web-workers";

export default defineComponent({
  name: "Connect",
  props: {},
  components: { PulseLoader },
  data() {
    return {
      isLoading: false,
      error: null,
      contextName: config.veridaContextName,
      veridaConnnectLogo: config.veridaConnnectLogo,
      message: "",
    };
  },
  methods: {
    async onSuccess(context: any) {
      try {
        this.isLoading = true;
        await veridaClient.connectVault(context);

        // // initialize messaging in a different thread
        webWorker.send();
        this.$router.push({ name: "Home" });
      } catch (error: any) {
        this.error = error;
      } finally {
        this.isLoading = false;
      }
    },
    onError(error: any) {
      this.error = error;
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../assets/scss/main.scss";

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  height: 40rem;
}
</style>
