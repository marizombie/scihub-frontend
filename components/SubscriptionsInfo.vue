<template>
  <v-dialog v-model="showCanceConfirmationDialog" max-width="400px">
    <v-card>
      <v-card-title>Are you sure?</v-card-title>
      <v-card-text class="pa-0 px-4"
        >Are you sure? You will loose all subscription perks until
        renewed.</v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          variant="text"
          @click="showCanceConfirmationDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="text"
          color="error"
          class="mr-6 removeClass"
          @click="
            showDescribeReasonDialog = true;
            showCanceConfirmationDialog = false;
          "
        >
          Continue
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="showDescribeReasonDialog" max-width="400px">
    <v-card>
      <v-card-title class="no-word-breake"
        >One quick question: why did you decide to cancel
        subscription?</v-card-title
      >
      <v-textarea
        :rules="rules"
        counter="250"
        rows="2"
        class="px-4"
        v-model="cancelReason"
        auto-grow
      ></v-textarea>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          variant="text"
          @click="showDescribeReasonDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="text"
          color="error"
          class="mr-6 removeClass"
          @click="cancelSub()"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <h3 class="mb-6"><b>Plan</b></h3>
  <v-row :class="!display.mdAndUp ? 'flex-column' : ''" class="my-6 sub-cards">
    <v-col cols="3">
      <v-card class="d-flex flex-column align-center pa-4 subscription-card">
        <h1>Affiliate marketer</h1>
        <v-card-text>Valid until September 3, 2024</v-card-text>
        <v-btn @click="showCanceConfirmationDialog = true"
          >Cancel subscription</v-btn
        >
      </v-card>
    </v-col>
    <v-col cols="3">
      <v-card
        class="d-flex flex-column align-center pa-4 subscription-card"
        color="primary"
      >
        <h1>Business user</h1>
        <v-card-text>Read more</v-card-text>
        <v-btn>Upgrade</v-btn>
      </v-card>
    </v-col>
  </v-row>
  <div class="d-flex align-center">
    <h3><b>Renew subscription automatically</b></h3>
    <v-switch density="compact" hide-details class="ml-5"></v-switch>
  </div>
  <span class="no-accent"
    >All payment data is secure and kept only on Stripe’s end</span
  >
  <h3 class="mt-3"><b>Payment method</b></h3>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { useNotificationStore, useUserStore } from '~/store';
import type { CommentData, ProfileInfo } from '~/types';

const display = ref(useDisplay() || null);
const showCanceConfirmationDialog = ref(false);
const showDescribeReasonDialog = ref(false);
const cancelReason = ref('');
const rules = ref([
  (value: any) => {
    return value.length > 250
      ? 'You exceed limit of symbols. Maximum is 250'
      : true;
  }
]);

async function cancelSub() {
  if (
    typeof rules.value[0](cancelReason.value) === 'boolean' &&
    rules.value[0](cancelReason.value)
  ) {
    const { data, error } = await useAPIFetch(`api/cancel-subscription/`, {
      method: 'post',
      body: { cancellation_reason: cancelReason.value }
    });
    const notifyStore = useNotificationStore();
    if (error.value) {
      if (error.value?.data?.error) {
        await notifyStore.setNotification({
          type: 'error',
          message: error.value.data.error
        });
      } else {
        await notifyStore.setNotification({
          type: 'error',
          message: error.value.toString()
        });
      }
    } else {
      await notifyStore.setNotification({
        type: 'success',
        message:
          'Subscription successfully cancelled, but can be renewed whenever you decide'
      });
    }
    showDescribeReasonDialog.value = false;
  }
}
</script>

<style lang="less" scoped>
@import '../assets/breakpoints.less';

.no-accent {
  color: rgb(var(--v-theme-noAccent));
}

.subscription-card {
  border-radius: 10px;
  :deep(.v-card-text) {
    font-size: 18px;
  }
}

.no-word-break {
  white-space: unset;
}
</style>
