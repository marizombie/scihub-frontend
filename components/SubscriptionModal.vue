<template>
  <v-row justify="center">
    <v-dialog class="dialog" v-model="props.dialog" max-width="900px">
      <v-card class="pa-8">
        <v-row justify="center">
          <v-col cols="12" class="text-center">
            <h1>Pricing plans</h1>
          </v-col>
          <v-col cols="12" class="text-center">
            <v-btn-toggle
              v-model="toggle"
              class="mb-4 border-primary"
              color="primary"
              mandatory
              rounded="xl"
            >
              <v-btn value="monthly"><b>monthly</b></v-btn>
              <v-btn value="yearly"><b>yearly</b></v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="12" md="4" class="d-flex justify-center">
            <v-hover v-slot:default="{ isHovering, props }">
              <v-card
                outlined
                class="py-5 px-3 price-card border-primary pt-1 d-flex flex-column"
                :class="{ 'hovered-card': isHovering }"
                v-bind="props"
              >
                <v-card-title class="py-0 text-center"
                  ><b class="subscription-name">Free user</b></v-card-title
                >
                <span class="text-center price"><b>0€</b></span>
                <v-card-text class="price-desc">
                  <ul class="list-unstyled">
                    <li>read unlim</li>
                    <li>
                      writing unlim without affiliate and other referral links
                      (incl. own youtube)
                    </li>
                  </ul>
                </v-card-text>
                <v-btn
                  color="primary"
                  class="buy-button"
                  @click="emit('closeDialog')"
                  >Continue</v-btn
                >
              </v-card>
            </v-hover>
          </v-col>
          <v-col
            cols="12"
            md="4"
            class="d-flex justify-center"
            v-for="(item, index) in subscriptions"
            :key="index"
          >
            <v-hover v-slot:default="{ isHovering, props }">
              <v-card
                outlined
                class="py-5 px-3 price-card border-primary pt-1 d-flex flex-column"
                :class="{ 'hovered-card': isHovering }"
                v-bind="props"
              >
                <!-- <v-chip
                  color="primary"
                  density="compact"
                  style="width: fit-content"
                  >popular</v-chip
                > -->
                <!-- <v-card-title class="py-0 text-center"
                  >Affiliate marketer</v-card-title
                > -->
                <v-card-title class="py-0 text-center"
                  ><b class="subscription-name">{{
                    item.name
                  }}</b></v-card-title
                >
                <!-- <span class="subTitle">for 1 person businesses</span> -->
                <!-- <s>108 €</s> -->
                <span class="text-center"
                  ><b class="price">{{ item.price.price }}€</b>
                </span>
                <!-- <v-card-text class="text-body-1">
                  <ul class="list-unstyled">
                    <li>read unlim</li>
                    <li>
                      writing unlim, posts can contain affiliate & other
                      referral links (incl. own youtube)
                    </li>
                  </ul>
                </v-card-text> -->
                <v-card-text class="price-desc">
                  {{ item.description }}
                  <!-- <ul class="list-unstyled">
                    <li>read unlim</li>
                    <li>
                      writing unlim, posts can contain affiliate & other
                      referral links (incl. own youtube)
                    </li>
                  </ul> -->
                </v-card-text>
                <v-btn color="primary" class="buy-button">Buy</v-btn>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup>
import { ref } from 'vue';

const toggle = ref('yearly');
const emit = defineEmits(['closeDialog']);
const props = defineProps({
  dialog: {
    type: Boolean
  }
});

const subscriptions = ref([]);

const fetchItems = async () => {
  console.log('fetchItems');
  const { data, error } = await useAPIFetch(`api/subscription-types/`);
  console.log(error);
  if (data.value) {
    subscriptions.value = data.value;
  }
  if (error.value) {
    const notifyStore = useNotificationStore();
    await notifyStore.setNotification({
      type: 'error',
      message: error.value.data?.detail
        ? error.value.data?.detail
        : error.value.data.toString()
    });
  }
};

await fetchItems();
</script>

<style scoped>
.dialog {
  font-family: 'Inter';
}

.price-card {
  max-width: 260px;
}

.v-btn-toggle .v-btn {
  min-width: 100px;
}

.border-primary {
  border: 3px solid;
  border-color: rgb(var(--v-theme-primary));
  border-radius: 10px;
}

.buy-button {
  width: 75%;
  height: 54px;
  min-width: 50%;
  align-self: center;
  font-size: 20px;
  font-weight: bold;
  text-transform: unset;
  border-radius: 10px;
}

.subTitle {
  opacity: 0.65;
  color: grey;
  text-align: center;
  font-size: small;
  margin-top: -10px;
}

.price {
  font-size: 36px !important;
}

.subscription-name {
  font-size: 28px;
}

.price-desc {
  font-size: 17px;
}

.hovered-card {
  transform: scale(1.1);
  transition-duration: 150ms;
  z-index: 10;
  transition-property:
    color,
    background-color,
    border-color,
    text-decoration-color,
    fill,
    stroke,
    opacity,
    box-shadow,
    transform,
    filter,
    backdrop-filter,
    -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
