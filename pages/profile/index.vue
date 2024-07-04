<template>
  <v-dialog
    v-model="showDeleteProfileDialog"
    max-width="600px"
    v-if="showDeleteProfileDialog"
    class="delete-modal"
  >
    <v-card>
      <v-card-title class="mt-4 pa-0 pl-4 pb-4">
        <span class="text-h5">Are you sure want to delete your profile?</span>
      </v-card-title>
      <v-card-text class="pa-0 pl-4">
        Deletion is not reversible. After you delete your profile, we can't help
        you to restore it. All your created data will be deleted together with
        your profile.
      </v-card-text>
      <v-card-actions class="mb-4">
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          variant="text"
          @click="showDeleteProfileDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="text"
          color="error"
          class="mr-6 removeClass"
          @click="onDeleteProfile()"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-card :class="[display.mdAndUp ? 'pa-12' : 'pa-2', 'profile-card']">
    <v-card-title>Profile</v-card-title>
    <v-row :class="!display.mdAndUp ? 'flex-column' : ''">
      <v-col
        :cols="!display.mdAndUp ? '' : 4"
        :class="!display.mdAndUp ? 'flex-unset' : ''"
      >
        <v-avatar
          color="grey"
          class="avatar-preview"
          :size="display.mdAndUp ? '290' : '100%'"
          :image="
            currentFilePreview ? currentFilePreview : `${profile.avatar_url}`
          "
        >
        </v-avatar>
        <v-file-input
          class="file-input mt-3"
          label="Change Image"
          variant="underlined"
          clearable
          :rules="rules"
          accept="image/jpeg, image/png, image/gif"
          v-model="profileImage"
          :multiple="false"
          @change="setFile($event)"
          @click:clear="currentFilePreview = ''"
        ></v-file-input>
      </v-col>
      <v-col :cols="!display.mdAndUp ? '' : 4">
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
        v-model="profile.about"
        outlined
        counter="250"
      />
      <div v-if="tags.length">
        <div class="subtitle">Following</div>
        <v-chip-group :column="!display.mdAndUp">
          <v-chip
            v-for="tag in tags"
            :key="tag.slug"
            closable
            @click:close="removeTag(tag.slug)"
            @click="searchByTag(tag.text)"
          >
            {{ tag.text }}
          </v-chip>
        </v-chip-group>
      </div>
    </div>
    <v-card-actions>
      <v-btn
        color="error"
        variant="text"
        @click="showDeleteProfileDialog = true"
      >
        Delete profile
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" variant="text" @click="redirectToHomePage()">
        Cancel
      </v-btn>
      <v-btn
        color="blue darken-1"
        variant="text"
        @click="profileSend()"
        :loading="sendLoading"
        :disabled="
          rules[0](profileImage) === 'Avatar size should be less than 2 MB!'
        "
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { useNotificationStore, useUserStore } from '~/store';
import type { CommentData, ProfileInfo } from '~/types';

definePageMeta({
  middleware: ['auth']
});

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
  };
}

interface SuccessResponse {
  success: ProfileInfo;
}

interface TagItem {
  text: string;
  slug: string;
}

const display = ref(useDisplay() || null);
const profileImage: Ref<File[]> = ref([]);
const currentFilePreview = ref('');
const profile: Ref<ProfileInfo> = ref({
  first_name: '',
  last_name: '',
  email: '',
  about: '',
  username: '',
  avatar_url: '',
  avatar: null,
  country: ''
});
const tags: Ref<TagItem[]> = ref([]);
const sendLoading = ref(false);
const rules = ref([
  (value: any) => {
    return (
      !value ||
      !value.length ||
      value[0].size < 2000000 ||
      'Avatar size should be less than 2 MB!'
    );
  }
]);
const showDeleteProfileDialog = ref(false);

function setFile(files: File[]) {
  if (profileImage.value) {
    currentFilePreview.value = URL.createObjectURL(profileImage.value[0]);
  }
}

onMounted(async () => {
  const { data } = await useAPIFetch<ProfileInfo>('/api/profile/');
  if (data.value) {
    profile.value = data.value;
  }

  const { data: followedTags } =
    await useAPIFetch<TagsResponse>('api/followed-tags/');
  if (followedTags.value) {
    tags.value = followedTags.value!.results.reduce((acc, value) => {
      return acc.concat({
        text: value.followed_tag.name,
        slug: value.followed_tag.slug
      });
    }, [] as TagItem[]);
  }
});

async function redirectToHomePage() {
  await navigateTo('/');
}

async function profileSend() {
  sendLoading.value = true;
  const formData = new FormData();
  if (!profileImage.value.length) {
    delete profile.value.avatar;
  } else {
    profile.value.avatar = profileImage.value[0];
  }
  for (const keyData in profile.value) {
    //@ts-ignore
    formData.append(keyData, profile.value[keyData]);
  }
  const { data } = await useAPIFetch<SuccessResponse>('/api/profile/', {
    method: 'PUT',
    body: formData
  });
  sendLoading.value = false;
  if (data.value) {
    const notifyStore = useNotificationStore();
    await notifyStore.setNotification({
      type: 'success',
      message: 'Succesfully saved'
    });
    const userStore = useUserStore();
    userStore.setUserAvatar(data.value.success.avatar_url);
  }
}

async function removeTag(tag: string) {
  const { data, error } = await useAPIFetch<CommentData[]>(
    `api/toggle-follow/tag/${tag}/`,
    {
      method: 'post'
    }
  );
  if (error.value?.data) {
    if (error.value) {
      const notifyStore = useNotificationStore();
      await notifyStore.setNotification({
        type: 'error',
        message: error.value.data.detail
      });
    }
  } else {
    tags.value = tags.value.filter((item: TagItem) => item.slug !== tag);
  }
}
async function searchByTag(tag: string) {
  await navigateTo(`/?tag=${tag}`);
}

async function onDeleteProfile() {
  const { data, error } = await useAPIFetch<CommentData[]>(`api/profile/`, {
    method: 'delete'
  });
  if (error.value?.data) {
    if (error.value) {
      const notifyStore = useNotificationStore();
      await notifyStore.setNotification({
        type: 'error',
        message: error.value.data.detail
      });
    }
  } else {
    const userStore = useUserStore();
    userStore.logout();
    await navigateTo(`/`);
  }
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
