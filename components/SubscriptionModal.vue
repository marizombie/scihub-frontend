<template>
  <v-row justify="center">
    <v-dialog v-model="props.dialog" max-width="800px">
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
              <v-btn value="monthly">monthly</v-btn>
              <v-btn value="yearly">yearly</v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="12" md="4" class="d-flex justify-center">
            <v-hover v-slot:default="{ isHovering, props }">
              <v-card
                outlined
                class="py-5 px-3 price-card border-primary d-flex flex-column"
                :class="{ 'hovered-card': isHovering }"
                v-bind="props"
              >
                <v-card-title class="text-center">Free user</v-card-title>
                <span class="text-center">0 €</span>
                <v-card-text class="text-body-1">
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
          <v-col cols="12" md="4" class="d-flex justify-center">
            <v-hover v-slot:default="{ isHovering, props }">
              <v-card
                outlined
                class="py-5 px-3 price-card border-primary pt-1 d-flex flex-column"
                :class="{ 'hovered-card': isHovering }"
                v-bind="props"
              >
                <v-chip
                  color="primary"
                  density="compact"
                  style="width: fit-content"
                  >popular</v-chip
                >
                <v-card-title class="py-0 text-center"
                  >Affiliate marketer</v-card-title
                >
                <span class="subTitle">for 1 person businesses</span>
                <span class="text-center"
                  ><b class="text-h5">80 €</b> <s>108 €</s></span
                >
                <v-card-text class="text-body-1">
                  <ul class="list-unstyled">
                    <li>read unlim</li>
                    <li>
                      writing unlim, posts can contain affiliate & other
                      referral links (incl. own youtube)
                    </li>
                  </ul>
                </v-card-text>
                <v-btn color="primary" class="buy-button">Buy</v-btn>
              </v-card>
            </v-hover>
          </v-col>
          <v-col cols="12" md="4" class="d-flex justify-center">
            <v-hover v-slot:default="{ isHovering, props }">
              <v-card
                outlined
                class="py-5 px-3 price-card border-primary d-flex flex-column"
                :class="{ 'hovered-card': isHovering }"
                v-bind="props"
              >
                <v-card-title class="pb-0 text-center"
                  >Business user</v-card-title
                >
                <span class="subTitle">for companies</span>
                <span class="text-center"
                  ><b class="text-h5">160 €</b> <s>228 €</s></span
                >
                <v-card-text class="text-body-1">
                  <ul class="list-unstyled">
                    <li>all Affiliate marketer has +</li>
                    <li>posts can include company promotions</li>
                  </ul>
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

const fetchItems = async () => {
  console.log('fetchItems');
  const { data, error } = await useAPIFetch(`api/subscription-types/`);
  console.log(error);
  if (data.value) {
    // searchedPosts.value = data.value;
    console.log(data.value);
  }
};

await fetchItems();
</script>

<style scoped>
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
  min-width: 50%;
  align-self: center;
}

.subTitle {
  opacity: 0.65;
  color: grey;
  text-align: center;
  font-size: small;
  margin-top: -10px;
}

.hovered-card {
  transform: scale(1.15);
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
