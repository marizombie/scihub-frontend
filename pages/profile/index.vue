<template>
  <v-card :class="[display.mdAndUp ? 'pa-12' : 'pa-2', 'profile-card']">
    <v-card-title>Profile</v-card-title>
    <v-row :class="!display.mdAndUp ? 'flex-column' : ''">
      <v-col cols="4" :class="!display.mdAndUp ? 'flex-unset' : ''">
        <v-avatar color="grey" class="avatar-preview" :size="display.mdAndUp ? '290' : '100%'"
          image="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg">
        </v-avatar>
        <v-file-input class="file-input mt-3" label="Change Image" variant="underlined" clearable accept="jpeg, png, bmp"
          :model-value="profileImage" @change="setFile($event)"></v-file-input>
      </v-col>
      <v-col cols="4">
        <v-text-field label="Name" v-model="profile.first_name" variant="outlined" hide-details class="pb-4" />
        <v-text-field label="Last name" v-model="profile.last_name" variant="outlined" hide-details class="pb-4" />
        <!-- <v-text-field
          label="Email"
          v-model="profile.email"
          outlined
          hide-details
        /> -->
        <v-text-field label="Username" v-model="profile.username" variant="outlined" hide-details class="pb-4" />
      </v-col>
    </v-row>

    <div class="mt-6">
      <v-textarea label="About" v-model="profile.about" outlined counter="250" />
      <div class="subtitle">Following</div>
      <v-chip-group>
        <v-chip v-for="tag in tags" :key="tag" closable @click:close="removeTag(tag)" @click="searchByTag(tag)">
          {{ tag }}
        </v-chip>
      </v-chip-group>
    </div>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" variant="text" @click="redirectToHomePage()">
        Cancel
      </v-btn>
      <v-btn color="blue darken-1" variant="text" @click="profileSend()">
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { ProfileInfo } from "~/types";

interface TagsResponse {
  results: TagInfo[];
}

interface TagInfo {
  date_followed: string;
  id: number;
  followed_tag: {
    followers_count: number;
    id: number;
    name: string;
    slug: string;
  }
}

const display = ref(useDisplay() || null);
const profileImage: Ref<File[] | undefined> = ref(undefined);
const profile: Ref<ProfileInfo> = ref({
  first_name: "",
  last_name: "",
  email: "",
  about: "",
  username: "",
  avatar: "",
  country: "",
});
const tags = ref(["ml", "technologies", "biology", "mathematics"]);

function setFile(file: File[]) {
  profileImage.value = file;
}
const { data } = await useAPIFetch<ProfileInfo>("/api/profile/");
if (data.value) {
  profile.value = data.value;
}

const { data: followedTags } = await useAPIFetch<TagsResponse>("api/followed-tags/");
if (followedTags.value) {
  tags.value = followedTags.value!.results.reduce((acc, value) => {
    return acc.concat(value.followed_tag.name)
  }, [] as string[]);
}

async function redirectToHomePage() {
  await navigateTo("/");
}
async function profileSend() { }
function removeTag(tag: string) {
  tags.value = tags.value.filter((item) => item !== tag);
}
async function searchByTag(tag: string) {
  await navigateTo(`/?tag=${tag}`);
}
</script>

<style lang="less" scoped>
@import "../assets/breakpoints.less";

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
