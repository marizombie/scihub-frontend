<i18n lang="json">
{
  "en": {
    "email": "Email",
    "password": "Password",
    "confirm_password": "Password confirmation",
    "username": "Username",
    "signup_title": "Sign Up",
    "cancel": "Cancel",
    "resendLink": "Resend link?"
  }
}
</i18n>

<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <form @submit.prevent="onSubmit">
          <v-card-title class="mt-4">
            <span class="text-h5 pl-6">{{ props.title ? props.title : t("signup_title") }}</span>
          </v-card-title>
          <v-card-text class="pb-0">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field :label="t('email')" variant="outlined" v-model="email.value.value"
                    :error-messages="email.errorMessage.value"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field :label="t('password')" variant="outlined" v-model="password.value.value"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :type="show1 ? 'text' : 'password'"
                    @click:append="show1 = !show1" :error-messages="password.errorMessage.value"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field :label="t('confirm_password')" :type="show2 ? 'text' : 'password'"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" variant="outlined"
                    v-model="password_verifier.value.value" @click:append="show2 = !show2"
                    :error-messages="password_verifier.errorMessage.value"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="pt-0 pb-0">
                  <p class="errorField" v-for="(errorItem, index) in errorsArray" :key="index">
                    {{
                      errorItem.name !== "detail"
                      ? t(errorItem.name) + ": " + errorItem.data
                      : errorItem.data
                    }}
                  </p>
                </v-col>
              </v-row>
              <div class="ml-1 d-flex align-center">
                <span>Already have an account?</span><v-btn variant="plain" flat class="pl-1 pr-1 sign-in" :ripple="false"
                  color="primary" text="Sign in" @click="emit('showAuthDialog')">
                </v-btn>
              </div>
            </v-container>
          </v-card-text>
          <v-card-actions class="mb-4">
            <v-btn color="blue darken-1" class="ml-6" variant="text"
              @click="emit('showResendLinkDialog'); dialog = false">
              {{ t("resendLink") }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" variant="text" @click="dialog = false">
              {{ t("cancel") }}
            </v-btn>
            <v-btn color="blue darken-1" :loading="isLoading" variant="text" class="mr-6" @click="onSubmit" type="submit">
              {{ t("signup_title") }}
            </v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import { useNotificationStore } from "../store/index";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { ErrorKeyValue, SuccessResponse } from "~/types";
const { t } = useI18n({
  useScope: "local",
});

interface RegisterInfo {
  email: string;
  password: string;
  password_verifier: string;
}

const emit = defineEmits(["closeDialog", "showResendLinkDialog", "showAuthDialog"]);
const props = defineProps({
  showDialog: {
    type: Boolean,
  },
  title: {
    type: String,
    default: ''
  }
});
let dialog = ref(false);
let registerData: Ref<RegisterInfo> = ref({
  email: "",
  password: "",
  password_verifier: "",
});
const isLoading = ref(false);
const errorsArray: Ref<ErrorKeyValue[]> = ref([]);
const notifyStore = useNotificationStore();
const show1 = ref(false);
const show2 = ref(false);

watch(dialog, (val) => {
  if (!val) {
    emit("closeDialog");
  }
});

watch(
  () => props.showDialog,
  (val) => {
    dialog.value = val;
  },
);

const validationSchema = markRaw(
  yup
    .object({
      email: yup.string().email().required().label("Email Address"),
      password: yup.string().required().min(6).label("Password"),
      password_verifier: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required()
        .min(6)
        .label("Password confirmation"),
    })
    .required(),
);

const { handleSubmit, errors } = useForm({
  validationSchema: validationSchema,
  initialValues: registerData.value,
});

const email = useField("email", validationSchema);
const password = useField("password", validationSchema);
const password_verifier = useField("password_verifier", validationSchema);

const onSubmit = handleSubmit(async (values) => {
  errorsArray.value = [];
  isLoading.value = true;
  const { data, error } = await useAPIFetch("/api/register/", {
    method: "post",
    body: values,
  });
  if (error.value?.data) {
    for (const key in error.value.data) {
      errorsArray.value.push({
        name: key,
        data: Array.isArray(error.value.data[key])
          ? error.value.data[key][0]
          : error.value.data[key],
      });
    }
  }
  if (data.value) {
    await notifyStore.setNotification({
      type: "info",
      message: (data.value as SuccessResponse).success,
    });
    dialog.value = false;
  }
  isLoading.value = false;
});
</script>

<style lang="less" scoped>
.errorField {
  color: rgb(var(--v-theme-error));
}

.sign-in {
  opacity: 1;
  text-transform: unset;
}
</style>
