<template>
  <div class="notification">
    <div v-for="item in notifications" :key="item.id">
      <v-alert
        class="mb-4"
        eager
        :text="item.message"
        :type="item.type"
        density="compact"
        icon="false"
      ></v-alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '~/store';

const notificationStore = useNotificationStore();
let notifications = computed(() => notificationStore.notificationsArray);
</script>

<style lang="less" scoped>
@import '../assets/breakpoints.less';

.notification {
  position: sticky;
  z-index: 9999;
  width: 80%;
  display: block;
  top: 140px;
  left: 10%;
  margin-bottom: 20px;

  @media (min-width: @md-min) {
    width: 450px;
    left: 40%;
    top: 65px;
  }
}
</style>
