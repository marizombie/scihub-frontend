<i18n lang="json">
{
  "en": {
    "password": "Password",
    "confirm_password": "Password confirmation",
    "username": "Username",
    "title": "Set your password",
    "cancel": "Cancel",
    "save": "Save"
  }
}
</i18n>
  
<template>
  <v-card class="confirm-password">
    <form @submit.prevent="onSubmit" autocomplete="off">
      <v-card-title class="mt-4">
        <span class="text-h5 pl-6">{{ t("title") }}</span>
      </v-card-title>
      <v-card-text class="pb-0">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field autocomplete="none" :label="t('password')" type="password" variant="outlined"
                v-model="new_password.value.value" :error-messages="new_password.errorMessage.value"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field autocomplete="none" :label="t('confirm_password')" type="password" variant="outlined"
                v-model="confirm_password.value.value"
                :error-messages="confirm_password.errorMessage.value"></v-text-field>
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
        <v-btn color="blue darken-1" variant="text" :to="'/'">
          {{ t("cancel") }}
        </v-btn>
        <v-btn color="blue darken-1" :loading="isLoading" variant="text" class="pr-6" @click="onSubmit" type="submit">
          {{ t("save") }}
        </v-btn>
      </v-card-actions>
    </form>
  </v-card>
</template>
  
<script setup lang="ts">
import { useNotificationStore } from "../store/index";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
const { t } = useI18n({
  useScope: "local",
});

interface ConfirmPassswordInfo {
  new_password: string;
  confirm_password: string;
}

interface errorKeyValue {
  name: string;
  data: string;
}

interface apiAnswer {
  success: string;
}

let registerData: Ref<ConfirmPassswordInfo> = ref({
  new_password: "",
  confirm_password: "",
});
const isLoading = ref(false);
const errorsArray: Ref<errorKeyValue[]> = ref([]);
const notifyStore = useNotificationStore();
const token = ref('');

const validationSchema = markRaw(
  yup
    .object({
      new_password: yup.string().required().min(6).label("Password"),
      confirm_password: yup
        .string()
        .oneOf([yup.ref("new_password")], "Passwords must match")
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

const new_password = useField("new_password", validationSchema);
const confirm_password = useField("confirm_password", validationSchema);

const onSubmit = handleSubmit(async (values) => {
  errorsArray.value = [];
  isLoading.value = true;
  const { data, error } = await useAPIFetch(`/api/confirm-password/?token=${token.value}`, {
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
      message: (data.value as apiAnswer).success,
    });
  }
  isLoading.value = false;
});

const route = useRoute()
if (route.query.token) {
  token.value = route.query.token as string;
}
</script>
  
<style lang="less" scoped>
.confirm-password {
  width: 600px;
}

.errorField {
  color: rgb(var(--v-theme-error));
}
</style>
  