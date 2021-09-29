<template>
  <div class="login-section">
    <div class="loader" v-if="isLoading">
      <pulse-loader :loading="isLoading" />
    </div>
    <div class="connect" v-else>
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

export default defineComponent({
  name: "Connect",
  props: {},
  components: {
    PulseLoader,
  },
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    async connect() {
      this.isLoading = true;
      try {
        await veridaClient.connectVault();
        this.isLoading = false;
        this.$router.push({ name: "Home" });
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    onClose(event: any) {
      if (
        event.target.id === "verida-modal" ||
        event.target.id === "verida-modal-close"
      ) {
        this.isLoading = false;
      }
    },
  },
  created() {
    window.addEventListener("click", this.onClose);
  },
});
</script>

<style lang="scss" scoped>
.login-section {
  position: absolute;
  width: 45%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  @media (max-width: 768px) {
    width: 100%;
  }
}
.connect {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column nowrap;
  margin: 0 0.5rem;
  background: #ffffff;
  padding: 0.5rem 0.4rem;
  box-shadow: 0px 4px 44px rgba(0, 0, 0, 0.04);
  border-radius: 8px;
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
