<template>
  <div>
    <h2>Profile</h2>
    <v-tabs v-model="tab" color="primary" direction="vertical" class="mt-1">
      <v-tab prepend-icon="mdi-account" text="Account info" :value="1"></v-tab>
      <v-tab
        prepend-icon="mdi-account-credit-card"
        text="Subscriptions"
        :value="2"
      ></v-tab>
    </v-tabs>
  </div>
  <v-card :class="[display.mdAndUp ? 'pa-12' : 'pa-2', 'profile-card']">
    <AccountInfo v-if="tab === 1" />
    <SubscriptionsInfo v-if="tab === 2" />
  </v-card>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { useNotificationStore, useUserStore } from '~/store';
import type { CommentData, ProfileInfo } from '~/types';

definePageMeta({
  middleware: ['auth']
});
const tab = ref(null);
const display = ref(useDisplay() || null);
</script>

<style lang="less" scoped>
@import '../assets/breakpoints.less';

.profile-card {
  width: 100%;
}

.file-input {
  @media (min-width: @sm-min) {
    width: 90%;
  }
}

.subtitle {
  font-size: 1.25rem;
  font-weight: 500;
}

.flex-unset {
  flex: unset;
}
</style>
