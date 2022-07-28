<template>
  <app-header :setStatus="setStatus" />
  <div v-if="connected" class="app-section">
    <div class="credential-form">
      <img src="../assets/images/verida_logo.svg" alt="verida" />
      <h1>Register Licensed Professional</h1>
      <Form
        @submit="onSubmit"
        :validation-schema="validationSchema"
        class="grid-form"
      >
        <div class="form-block">
          <label for="did"> DID </label>
          <Field name="did" type="text" :value="did" />
          <ErrorMessage class="error-message" name="did" />
        </div>
        <div class="form-block">
          <label for="health-type"> Health type </label>
          <Field name="healthType" as="select">
            <option value="">Select type</option>
            <option v-for="type in healthTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </Field>
          <ErrorMessage class="error-message" name="healthType" />
        </div>
        <div class="form-block">
          <label for="firstName"> First Name </label>
          <Field name="firstName" type="text" />
          <ErrorMessage class="error-message" name="firstName" />
        </div>
        <div class="form-block">
          <label for="lastName"> Last Name </label>
          <Field name="lastName" type="text" />
          <ErrorMessage class="error-message" name="lastName" />
        </div>
        <div class="form-block">
          <label for="Reg Number"> Reg Number </label>
          <Field name="regNumber" type="number" />
          <ErrorMessage class="error-message" name="regNumber" />
        </div>
        <div class="form-block">
          <label for="Reg Exp. Number"> Registration Expiration Date </label>
          <Field name="regExpDate" type="date" />
          <ErrorMessage class="error-message" name="regExpDate" />
        </div>
        <div class="submit-btn form-block-btn">
          <button
            :class="['btn-default', isSubmitting && 'loading']"
            type="submit"
            :disabled="isSubmitting"
          >
            Issue Credential
          </button>
        </div>
      </Form>
    </div>
  </div>
  <div class="loading-pulse" v-else>
    <pulse-loader :loading="true" color="#000"></pulse-loader>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { veridaClient } from "@/helpers";
import { formSchema } from "@/utils/formValidation";

import AppHeader from "@/components/Header.vue";
import { ICredentials } from "@/interfaces/veridaClient.interfaces";

const { VUE_APP_MAPAY_SCHEMA } = process.env;

export default defineComponent({
  name: "Home",
  components: {
    AppHeader,
    PulseLoader,
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      connected: veridaClient.connected,
      did: veridaClient.did,
      healthTypes: [
        "Dentist",
        "Psychologist",
        "Optometrist",
        "Pharmacist",
        "Allied Health Professional",
      ],
      isSubmitting: false,
      validationSchema: formSchema,
    };
  },
  methods: {
    async onSubmit(values: ICredentials) {
      this.isSubmitting = true;

      const issueDate = new Date();

      const { firstName, lastName, regNumber, healthType, regExpDate, did } =
        values;

      const formValues = {
        name: "Your " + healthType + " Credential",
        firstName,
        lastName,
        regNumber,
        healthType,
        regExpDate,
        schema: VUE_APP_MAPAY_SCHEMA,
        testTimestamp: issueDate.toISOString(),
        summary: "Credential issued at " + issueDate.toDateString(),
      };

      try {
        const credentialData = await veridaClient.createDIDJwt(formValues, did);
        await veridaClient.sendMessage(credentialData, did);
        this.$toast.success("Credentials Sent Successfully");
      } catch (error: any) {
        this.$toast.error(error.message);
      } finally {
        this.isSubmitting = false;
      }
    },

    setStatus(status: boolean) {
      this.connected = status;
      this.did = veridaClient.did as string;
    },
  },
});
</script>

<style lang="scss" scoped>
@import "../assets/scss/main.scss";

.error-message {
  color: red;
}

.input-text {
  font-weight: 600;
  font-size: 14px;
  line-height: 150%;
  font-family: Nunito Sans;
  color: rgba(4, 17, 51, 0.3);
}

.credential-form {
  @extend .app-container;
  img {
    margin: 2rem 0 1.5rem 0;
  }

  h1 {
    font-weight: bold;
    font-size: 1.8rem;
    line-height: 140%;
    text-align: center;
    margin-bottom: 3rem;
    color: #041133;
  }
}

.loading-pulse {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 3rem auto;
}

.dropdown {
  position: relative;
  &-value {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 20.5rem;
    height: 3rem;
    background: #ffffff;
    border: 1px solid #e0e3ea;
    border-radius: 4px;
    @extend .input-text;
    &-text {
      color: #000;
    }
    &:hover {
      border: 1px solid #009fe1;
    }
    & > * {
      padding: 0 0.8rem;
    }
  }
  &-select {
    position: absolute;
    width: 20.5rem;
    background: #ffffff;
    border: 1px solid #009fe1;
    box-sizing: border-box;
    margin: 0.7rem auto;
    border-radius: 4px;
    z-index: 2;
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.04);
    div {
      margin: 1rem auto;
      &:hover {
        background: #f6f7f9;
      }
      span {
        display: block;
        padding: 0.4rem;
      }
    }
  }
}

form {
  display: inline-block;
}

.error-message {
  color: red;
  font-size: 0.8rem;
}

.submit-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem auto 3rem auto;

  .btn-default {
    height: 3rem;
    padding: 0px 32px;
    outline: none;
    font-weight: bold;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    color: #ffffff;
    border: none;
    background: #2c558b;
    border-radius: 4px;
    &.loading {
      background: #333333;
      opacity: 0.5;
    }
  }
}

.grid-form {
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .form-block {
    &-btn {
      grid-column: 1 /3;
    }
    text-align: left;
    margin: 0.8rem 1.2rem;
    label {
      display: block;
      margin-bottom: 0.125rem;
    }
    input,
    select {
      width: 20.5rem;
      height: 3rem;
      background: #ffffff;
      border: 1px solid #e0e3ea;
      box-sizing: border-box;
      border-radius: 4px;
      outline: none;
      padding: 0 0.8rem;

      &::placeholder {
        @extend .input-text;
      }

      &:hover {
        background: #f8f8f8;
        border: 1px solid #e0e3ea;
        box-sizing: border-box;
        border-radius: 4px;
      }

      &:focus {
        background: #ffffff;
        border: 1px solid #009fe1;
        box-sizing: border-box;
        border-radius: 4px;
      }
    }
  }
}
</style>
