<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Authorization</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  variant="outlined"
                  label="Username*"
                  required
                  v-model="loginData.username"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  variant="outlined"
                  label="Password*"
                  type="password"
                  required
                  v-model="loginData.password"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" variant="text" @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" variant="text" @click="loginSend">
            Log in
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import { useUserStore } from "../store/index";

interface UserInfo {
  password: string;
  username: string;
}

const emit = defineEmits(["closeDialog"]);
const props = defineProps({
  showDialog: {
    type: Boolean,
  },
});
let { showDialog } = props;
const userStore = useUserStore();
let dialog = ref(false);
let loginData: Ref<UserInfo> = ref({
  username: "",
  password: "",
});

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

async function loginSend() {
  await userStore.login(loginData.value);
  dialog.value = false;
}
</script>
