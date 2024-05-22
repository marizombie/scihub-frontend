<template>
  <v-app>
    <Notification />
    <v-theme-provider :theme="theme.global.name.value">
      <v-app-bar fixed app class="header d-flex flex-column">
        <div class="main-content">
          <v-app-bar-title class="ml-4 title-icon">
            <a href="/">
              <v-img src="/favicon.ico" />
              <span>{{ title }}</span>
            </a>
          </v-app-bar-title>
          <div class="d-flex align-center ml-auto">
            <ForgotPassword
              :showDialog="showForgetPassword"
              @closeDialog="showForgetPassword = false"
            />
            <ResendLink
              :showDialog="showResendLink"
              @closeDialog="showResendLink = false"
            />
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-bind="props"
                  density="compact"
                  variant="solo"
                  v-if="display.smAndUp"
                  label="Search"
                  v-model="search"
                  single-line
                  hide-details
                  append-inner-icon="mdi-magnify"
                  @click="expandedSearch = true"
                  v-click-outside="{
                    handler: (e: MouseEvent) => (expandedSearch = false)
                  }"
                  :class="[
                    expandedSearch ? 'expand_search' : '',
                    'search mr-md-4'
                  ]"
                />
              </template>
              <v-list v-if="searchedPosts.length">
                <v-list-item
                  v-for="(item, index) in searchedPosts"
                  :key="index"
                  :value="index"
                  @click="handleChange(item.slug)"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-switch
              v-if="display.mdAndUp"
              v-model="darkTheme"
              hide-details
              :class="['ml-3', display.mdAndUp ? 'mr-10' : 'mr-2']"
              :label="` ${display.mdAndUp ? 'Dark theme' : ''}`"
            />
            <Auth
              :showDialog="showAuth"
              @closeDialog="
                showAuth = false;
                modalStore.removeModal();
              "
              @showForgetPasswordDialog="showForgetPassword = true"
              :redirectOnCancel="modalStore.currentModal?.prevRoute"
            />
            <v-btn
              @click="showAuth = true"
              class="header-button mr-md-4 ml-md-4"
              v-if="!userStore.userInfo"
            >
              Sign in
            </v-btn>
            <SignUp
              :showDialog="showSignUp"
              @closeDialog="
                showSignUp = false;
                modalStore.removeModal();
              "
              :title="signUpTitle"
              @showResendLinkDialog="showResendLink = true"
              @showAuthDialog="
                showSignUp = false;
                showAuth = true;
              "
            />
            <v-btn
              class="header-button ml-md-4 mr-md-5"
              variant="text"
              @click="showSignUp = true"
              v-if="!userStore.userInfo"
            >
              Sign up
            </v-btn>
            <v-btn
              prepend-icon="mdi-pencil"
              class="ml-8 mr-md-5 header-button"
              variant="text"
              @click="openCreatePage()"
              v-if="userStore.userInfo"
            >
              Write
            </v-btn>
            <v-menu v-if="userStore.userInfo">
              <template v-slot:activator="{ props }">
                <v-btn
                  size="48"
                  rounded
                  variant="outlined"
                  :ripple="false"
                  class="mr-6 plain-custom-style"
                  v-bind="props"
                >
                  <v-avatar size="48">
                    <v-img
                      v-if="userStore.userInfo.avatar"
                      :src="userStore.userInfo.avatar"
                      :alt="
                        userStore.userInfo.first_name +
                        ' ' +
                        userStore.userInfo.last_name
                      "
                    />
                    <span v-else>{{
                      userStore.userInfo.first_name[0] +
                      userStore.userInfo.last_name[0]
                    }}</span>
                  </v-avatar>
                </v-btn>
              </template>
              <v-list class="mx-auto" min-width="200px">
                <v-list-item link to="/profile">
                  <v-list-item-title>Profile</v-list-item-title>
                </v-list-item>
                <v-divider />
                <v-list-item @click="logoutAndRedirect()">
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>

        <div v-if="!display.smAndUp" class="additional-search mb-2">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                density="compact"
                variant="solo"
                label="Search"
                v-model="search"
                single-line
                hide-details
                append-inner-icon="mdi-magnify"
              />
            </template>
            <v-list v-if="searchedPosts.length">
              <v-list-item
                v-for="(item, index) in searchedPosts"
                :key="index"
                :value="index"
                @click="handleChange(item.slug)"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-app-bar>
      <v-main>
        <v-container class="custom-container">
          <slot />
        </v-container>
      </v-main>
      <cookie-banner v-if="!cookiesStore.getCurrentAccepts" />
    </v-theme-provider>
  </v-app>
</template>

<script setup lang="ts">
import { useDisplay, useTheme } from 'vuetify';
import {
  useModalsStore,
  useNotificationStore,
  useUserStore,
  useCookiesStore
} from '~/store';
import type { Article, SuccessResponse, ProfileInfo } from '~/types';

const userStore = useUserStore();
const cookiesStore = useCookiesStore();
const display = ref(useDisplay() || null);
const title = computed(() =>
  display.value.smAndDown ? 'Great Things Dev' : 'Great Things Development'
);
let search: Ref<string> = ref('');
let darkTheme: Ref<boolean> = ref(false);
let showAuth: Ref<boolean> = ref(false);
let signUpTitle: Ref<string> = ref('');
let showSignUp: Ref<boolean> = ref(false);
let showForgetPassword: Ref<boolean> = ref(false);
let showResendLink: Ref<boolean> = ref(false);
let expandedSearch: Ref<boolean> = ref(false);
let searchedPosts: Ref<Article[]> = ref([]);

await userStore.getUserInfoFromLS();
await cookiesStore.rehydrateCurrentAccepts();
const theme = useTheme();

watch(darkTheme, () => {
  toggleTheme();
});

const fetchItems = async () => {
  const { data, error } = await useAPIFetch<Article[]>(
    `/api/posts/?search=${search.value}`
  );
  if (data.value) {
    searchedPosts.value = data.value;
  }
};

const modalStore = useModalsStore();

watch(
  () => modalStore.currentModal,
  async (val) => {
    if (val) {
      if (val.name === 'SignUp') {
        signUpTitle.value = val.title;
        showSignUp.value = true;
      }
      if (val.name === 'Auth') {
        await new Promise((resolve) => setTimeout(resolve, 1));
        showAuth.value = true;
      }
    }
  },
  { immediate: true }
);

const debouncedFetchItems = useDebounce(fetchItems, 300);

watch(search, () => {
  debouncedFetchItems();
});

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
}

async function openCreatePage() {
  await navigateTo('/posts/create');
}

function handleChange(item: string | null) {
  search.value = '';
  navigateTo(`/posts/${item}`);
}

const route = useRoute();
if (route.query.token && route.name !== 'confirm-password') {
  const { data, error } = await useAPIFetch<SuccessResponse>(
    `/api/register/email-confirm/?activate=${route.query.token}`
  );
  if (data.value) {
    if (data.value.success) {
      const notifyStore = useNotificationStore();
      await notifyStore.setNotification({
        type: 'success',
        message: data.value.success
      });
    }
  }
  if (error.value) {
    console.error(error.value);
  }
}

function logoutAndRedirect() {
  userStore.logout();
  const onlyAuthRoutes = ['profile', 'posts-create'];
  if (onlyAuthRoutes.includes(route.name as string)) {
    navigateTo('/');
  }
}

watch(
  () => userStore.userInfo,
  async (val) => {
    if (val?.access) {
      const { data } = await useAPIFetch<ProfileInfo>('/api/profile/');
      if (data.value) {
        userStore.setUserName(data.value.username);
      }
    }
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
@import '../assets/breakpoints.less';

.header {
  height: 56px !important;

  @media (max-width: @sm-min) {
    height: 114px !important;
  }

  :deep(.v-toolbar__content) {
    height: 56px !important;

    @media (max-width: @sm-min) {
      display: flex;
      flex-direction: column;
      padding: 4px;
      min-height: 100%;
    }

    .main-content {
      display: flex;
      align-items: center;
      width: 100%;
    }

    a {
      font-weight: bold;
      color: inherit;
      text-decoration: none;
    }

    .additional-search {
      width: 94%;
    }
  }
}

:deep(.custom-container) {
  @media (max-width: @md-max) {
    max-width: 100%;
  }

  @media (min-width: @md-min) {
    display: flex;
    justify-content: center;
  }
}

:deep(.v-main) {
  @media (max-width: @sm-min) {
    padding-top: 106px !important;
  }
}

:deep(.v-toolbar-title) {
  flex: unset;
}

.v-container {
  max-width: 1400px;
}

.search {
  width: 220px;
  transition: width ease-out 0.5s;

  :deep(.mdi-menu-down) {
    display: none;
  }
}

.expand_search {
  width: 440px;
}

.header-button {
  font-weight: 700;
}

.plain-custom-style {
  opacity: 1;
  text-transform: unset;
}

:deep(.v-img__img) {
  object-fit: cover;
}

.title-icon {
  a {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .v-img {
    width: 32px;
    height: 32px;
    margin-right: 8px;
  }
}
</style>
