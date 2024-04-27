<template>
  <v-card :class="[display.mdAndUp ? 'pa-12' : 'pa-2', 'profile-card']">
    <v-card-title>Profile</v-card-title>
    <v-row :class="!display.mdAndUp ? 'flex-column' : ''">
      <v-col cols="4" :class="!display.mdAndUp ? 'flex-unset' : ''">
        <v-avatar
          v-if="profile.avatar"
          color="grey"
          class="avatar-preview"
          :size="display.mdAndUp ? '290' : '100%'"
          :image="profile.avatar"
        >
        </v-avatar>
        <v-icon v-else :size="display.mdAndUp ? '290' : '100%'">
          mdi-account-circle
        </v-icon>
      </v-col>
      <v-col cols="4">
        <v-text-field
          label="Name"
          v-model="profile.first_name"
          variant="outlined"
          hide-details
          class="pb-4"
        />
        <v-text-field
          label="Last name"
          v-model="profile.last_name"
          variant="outlined"
          hide-details
          class="pb-4"
        />
        <!-- <v-text-field
          label="Email"
          v-model="profile.email"
          outlined
          hide-details
        /> -->
        <v-text-field
          label="Username"
          v-model="profile.username"
          variant="outlined"
          hide-details
          class="pb-4"
        />
      </v-col>
    </v-row>

    <div class="mt-6">
      <v-textarea
        label="About"
        readonly
        v-model="profile.about"
        outlined
        counter="250"
      />
      <div class="subtitle">Following</div>
      <v-chip-group readonly>
        <v-chip v-for="tag in tags" :key="tag" @click="searchByTag(tag)">
          {{ tag }}
        </v-chip>
      </v-chip-group>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
import type { ProfileInfo } from '~/types';

const display = ref(useDisplay() || null);
const profile: Ref<ProfileInfo> = ref({
  first_name: '',
  last_name: '',
  email: '',
  about: '',
  username: '',
  avatar: '',
  country: ''
});
const tags = ref(['ml', 'technologies', 'biology', 'mathematics']);

const route = useRoute();

const { data } = await useAPIFetch<ProfileInfo>(
  `/api/profile/${route.params.username}`
);
if (data.value) {
  profile.value = data.value;
}
async function searchByTag(tag: string) {
  await navigateTo(`/?tag=${tag}`);
}
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
