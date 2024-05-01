<template>
  <div class="notification">
    <div class="absolute-block">
      <div v-for="item in notifications" :key="item.id">
        <v-alert
          class="mb-4"
          :text="item.message"
          :type="item.type"
          density="compact"
          icon="false"
        ></v-alert>
      </div>
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
.absolute-block {
  position: absolute;
  width:  100%;
  @media (min-width: @md-min) {
    width: 400px;
  }
  :deep(.v-alert) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.notification {
  position: sticky;
  z-index: 9999;
  width: 80%;
  display: block;
  top: 140px;
  left: 10%;
  :deep(.v-alert__prepend) {
    display: none;
  }

  @media (min-width: @md-min) {
    width: 450px;
    left: 40%;
    top: 65px;
  }
}
</style>
