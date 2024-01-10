<i18n lang="json">
{
  "en": {
    "username": "Email",
    "send": "Send",
    "forgotPassword": "Forgot Password?"
  }
}
</i18n>
  
<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <form @submit.prevent="onSubmit">
          <v-card-title class="mt-4">
            <span class="text-h5 pl-6">{{ t("forgotPassword") }}</span>
          </v-card-title>
          <v-card-text class="pb-0">
            <v-container>
              <v-row>
                <v-col cols="12" class="pb-0">
                  <v-text-field density="compact" variant="outlined" :label="t('username')" required
                    v-model="username.value.value" :error-messages="username.errorMessage.value"></v-text-field>
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
          <v-card-actions class="mb-4">
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" variant="text" @click="dialog = false">
              {{ t("cancel") }}
            </v-btn>
            <v-btn color="blue darken-1" variant="text" class="pr-6" :loading="isLoading" @click="onSubmit">
              {{ t("send") }}
            </v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-dialog>
  </v-row>
</template>
  
<script setup lang="ts">
import { useNotificationStore, useUserStore } from "../store/index";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import { ErrorKeyValue, SuccessResponse, UserInfo } from "~/types";
const { t } = useI18n({
  useScope: "local",
});

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
});
const isLoading = ref(false);
const errorsArray: Ref<ErrorKeyValue[]> = ref([]);

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
      username: yup.string().required().email().label("Email"),
    })
    .required(),
);

const { handleSubmit, errors } = useForm({
  validationSchema: validationSchema,
  initialValues: loginData.value,
});

const username = useField("username", validationSchema);

const onSubmit = handleSubmit(async (values) => {
  errorsArray.value = [];
  isLoading.value = true;
  const { data, error } = await useAPIFetch<SuccessResponse>("/api/reset-password/", {
    method: "post",
    body: { email: values.username },
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
    const notifyStore = useNotificationStore();
    await notifyStore.setNotification({
      type: "success",
      message: data.value.success as string,
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
</style>
  