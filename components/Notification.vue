<template>
  <div class="notification">
    <v-alert
      class="mb-4"
      eager
      v-for="item in notifications"
      :key="item.id"
      :text="item.error.message"
      closable
      type="error"
      density="compact"
      @click:close="notificationStore.removeNotification(item.id)"
      icon="false"
    ></v-alert>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from "~/store";

const notificationStore = useNotificationStore();
let notifications = computed(() => notificationStore.notificationsArray);
</script>

<style lang="less" scoped>
@import "../assets/breakpoints.less";

.notification {
  position: absolute;
  z-index: 10;
  width: 80%;
  display: block;
  top: 140px;
  left: 10%;
  margin-bottom: 20px;

  @media (min-width: @md-min) {
    width: 350px;
    left: 40%;
    top: 65px;
  }
}
</style>
