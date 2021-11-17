<template>
  <header class="header">
    <div></div>
    <div v-show="did" class="m-dropdown">
      <div
        @click="toggleDropdown"
        :class="['m-dropdown-top', isOpened && 'show']"
      >
        <img height="20" :src="avatar" alt="avatar" />
      </div>
      <div v-show="isOpened" class="m-dropdown-logout">
        <button @click="onLogout">Log out</button>
      </div>
    </div>
  </header>
</template>

<script>
import { defineComponent } from "vue";
import { veridaClient } from "@/helpers";

export default defineComponent({
  name: "Header",
  data() {
    return {
      isOpened: false,
      did: veridaClient.did,
      avatar: "",
    };
  },
  methods: {
    toggleDropdown() {
      this.isOpened = !this.isOpened;
    },

    async onLogout() {
      await veridaClient.logout();
      this.$router.push({ name: "Connect" });
    },
    setProfile() {
      this.avatar = veridaClient.profile.avatar;
    },
  },
  mounted() {
    this.setProfile();
  },
  created() {
    veridaClient.on("profileChanged", () => {
      this.setProfile();
    });
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

.m-dropdown {
  position: relative;
  &-top {
    background: #3333;
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    img {
      border-radius: 50%;
      height: 2.5rem;
      width: 2.5rem;
    }
    &.show {
      border: 1px #2c558b solid;
    }
  }

  &-logout {
    position: absolute;
    top: 3rem;
    text-align: center;
    right: -2rem;
    width: 10rem;
    padding: 2rem 0;
    background: #ffffff;
    border-radius: 4px;
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.04);

    button {
      padding: 0.4rem 2rem;
      background: #2c558b;
      outline: none;
      border: none;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        background: rgba(#2c558b, 0.8);
      }
    }
  }
}
</style>
