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
    :logo="logo"
    :openUrl="openUrl"
    :loginText="loginText"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { veridaClient } from "@/helpers/";
import { CONTEXT_NAME, LOGIN_TEXT, LOGO_URL } from "@/constants";

export default defineComponent({
  name: "Connect",
  props: {},
  components: { PulseLoader },
  data() {
    return {
      isLoading: false,
      error: null,
      openUrl: window.origin,
      contextName: CONTEXT_NAME,
      logo: LOGO_URL,
      loginText: LOGIN_TEXT,
    };
  },
  methods: {
    async onSuccess(context: any) {
      try {
        this.isLoading = true;
        await veridaClient.connectVault(context);

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
