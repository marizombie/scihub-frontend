<i18n lang="json">
{
  "en": {
    "password": "Password",
    "username": "Username",
    "auth_title": "Authorization",
    "cancel": "Cancel",
    "log_in": "Log in"
  }
}
</i18n>

<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <form @submit.prevent="onSubmit">
          <v-card-title>
            <span class="text-h5">{{ t("auth_title") }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field variant="outlined" :label="t('username')" required v-model="username.value.value"
                    :error-messages="username.errorMessage.value"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field variant="outlined" :label="t('password')" type="password" required
                    v-model="password.value.value" :error-messages="password.errorMessage.value"></v-text-field>
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
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" variant="text" @click="dialog = false">
              {{ t("cancel") }}
            </v-btn>
            <v-btn color="blue darken-1" variant="text" :loading="isLoading" @click="onSubmit">
              {{ t("log_in") }}
            </v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import { TokenInfo, useUserStore } from "../store/index";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
const { t } = useI18n({
  useScope: "local",
});

interface UserInfo {
  password: string;
  username: string;
}

interface errorKeyValue {
  name: string;
  data: string;
}

const emit = defineEmits(["closeDialog"]);
const props = defineProps({
  showDialog: {
    type: Boolean,
  },
});
const userStore = useUserStore();
let dialog = ref(false);
let loginData: Ref<UserInfo> = ref({
  username: "",
  password: "",
});
const isLoading = ref(false);
const errorsArray: Ref<errorKeyValue[]> = ref([]);

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
      username: yup.string().required().label("Email"),
      password: yup.string().required().label("Password"),
    })
    .required(),
);

const { handleSubmit, errors } = useForm({
  validationSchema: validationSchema,
  initialValues: loginData.value,
});

const username = useField("username", validationSchema);
const password = useField("password", validationSchema);

const onSubmit = handleSubmit(async (values) => {
  errorsArray.value = [];
  isLoading.value = true;
  const { data, error } = await useAPIFetch("/api/login/", {
    method: "post",
    body: { ...values, email: values.username },
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
    await userStore.setUserInfo(data.value as TokenInfo);
    dialog.value = false;
  }
  isLoading.value = false;
});
</script>

<style lang="less" scoped>
.errorField {
  color: rgb(var(--v-theme-error));
}
</style>
