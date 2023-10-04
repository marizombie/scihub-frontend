<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Sign up</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Email*"
                  variant="outlined"
                  v-model="registerData.email"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Password*"
                  type="password"
                  variant="outlined"
                  v-model="registerData.password"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Confirm password*"
                  type="password"
                  variant="outlined"
                  v-model="registerData.password_verifier"
                  required
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
          <v-btn color="blue darken-1" variant="text" @click="register">
            Sign up
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
import { useUserStore } from "../store/index";

interface RegisterInfo {
  email: string;
  password: string;
  password_verifier: string;
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
let registerData: Ref<RegisterInfo> = ref({
  email: "",
  password: "",
  password_verifier: "",
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

async function register() {
  await userStore.register(registerData.value);
  dialog.value = false;
}
</script>
