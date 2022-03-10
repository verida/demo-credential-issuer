<template>
  <vda-login
    :onError="onError"
    :onSuccess="onSuccess"
    :contextName="contextName"
    :logo="logo"
    :loginText="loginText"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { veridaClient } from "@/helpers/";

const { VUE_APP_CONTEXT_NAME, VUE_APP_LOGO_URL, VUE_APP_LOGIN_TEXT } =
  process.env;

export default defineComponent({
  name: "Connect",
  props: {},
  components: {},
  data() {
    return {
      isLoading: false,
      error: null,
      contextName: VUE_APP_CONTEXT_NAME,
      logo: VUE_APP_LOGO_URL,
      loginText: VUE_APP_LOGIN_TEXT,
    };
  },
  methods: {
    async onSuccess(context: any) {
      await veridaClient.connectVault(context);
      this.$router.push({ name: "Home" });
    },
    onError(error: any) {
      this.error = error;
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../assets/scss/main.scss";

.login-container {
  @extend .app-container;
}
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
}
.connect {
  padding: 1rem 0;
  height: 20rem;
  & > * {
    margin: 0.7rem 0;
  }

  h3 {
    font-weight: 600;
    font-size: 2.5rem;
  }
  p {
    word-break: inherit;
  }
  button {
    background: transparent;
    outline: none;
    border: none;
  }
}

.loader {
  @extend .connect;
}
</style>
