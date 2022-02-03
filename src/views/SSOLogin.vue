
<template>
  <!-- <vda-account :logo="logo" :contextName="contextName" :onLogout="onLogout" /> -->
  <vda-login
    :onError="onError"
    :onSuccess="onSuccess"
    :contextName="contextName"
    :logo="logo"
    :onLogout="onLogout"
  />
  <!-- <div class="login-container">
    <div class="loader" v-if="isLoading">
      <pulse-loader :loading="isLoading" />
    </div>
    <div class="connect" v-else>
      <div class="loader" v-if="isLoading">
        <pulse-loader :loading="isLoading" />
      </div>
      <img src="../assets/images/verida_logo.svg" alt="verida-btn" />
      <h3>Verifiable Credentials Demo</h3>
      <p>Use the button below to connect with Verida Vault</p>
      <button @click="connect">
        <img
          src="../assets/images/connect_with_verida_btn.png"
          alt="verida-btn"
        />
      </button>
    </div>
  </div> -->
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/ban-ts-comment */
// import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { defineComponent } from "vue";
import { mapMutations } from "vuex";
import { veridaClient } from "@/helpers/";
import { CONTEXT_NAME, LOGO } from "@/constant";

export default defineComponent({
  name: "Connect",
  props: {},
  components: {
    // PulseLoader,
  },
  data() {
    return {
      isLoading: false,
      error: null,
      contextName: CONTEXT_NAME,
      logo: LOGO,
    };
  },
  methods: {
    ...mapMutations(["setStatus"]),
    async connect() {
      this.isLoading = true;
      try {
        await veridaClient.connectVault();
        this.$router.push({ name: "Home" });
      } catch (error: any) {
        this.error = error;
      } finally {
        this.isLoading = false;
      }
    },
    onSuccess(response: any) {
      //@ts-ignore
      this.$vdaClient.initUser(response);
      this.setStatus();
      this.$router.push({ name: "Home" });
    },
    onError(error: Error) {
      console.log("Login Error", error);
    },
    onLogout() {
      console.log("hello");
    },
  },
  created() {
    veridaClient.on("authenticationCancelled", () => {
      this.isLoading = false;
    });
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
