<template>
  <div class="login-container">
    <div class="loader" v-if="isLoading">
      <pulse-loader :loading="isLoading" />
    </div>
    <div class="connect" v-else>
      <div class="loader" v-if="isLoading">
        <pulse-loader :loading="isLoading" />
      </div>
      <img src="../assets/images/verida_logo.svg" alt="verida-btn" />
      <h3>Connect now</h3>
      <p>Use the button below to connect with Verida Vault</p>
      <button @click="connect">
        <img
          src="../assets/images/connect_with_verida_btn.png"
          alt="verida-btn"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { defineComponent } from "vue";
import { veridaClient } from "@/helpers/";

type TData = {
  error: unknown;
  isLoading: boolean;
};

export default defineComponent({
  name: "Connect",
  props: {},
  components: {
    PulseLoader,
  },
  data(): TData {
    return {
      isLoading: false,
      error: null,
    };
  },
  methods: {
    async connect() {
      this.isLoading = true;
      try {
        await veridaClient.connectVault();
        this.$router.push({ name: "Home" });
      } catch (error) {
        this.error = error;
      } finally {
        this.isLoading = false;
      }
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
