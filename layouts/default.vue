<template>
  <v-app>
    <v-theme-provider :theme="theme.global.name.value">
      <v-app-bar fixed app class="header d-flex flex-column">
        <div class="main-content">
          <v-app-bar-title class="ml-4">
            <NuxtLink to="/">{{ title }}</NuxtLink>
          </v-app-bar-title>
          <div class="d-flex align-center ml-auto">
            <ForgotPassword :showDialog="showForgetPassword" @closeDialog="showForgetPassword = false" />
            <ResendLink :showDialog="showResendLink" @closeDialog="showResendLink = false" />
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-text-field v-bind="props" density="compact" variant="solo" v-if="display.mdAndUp" label="Search"
                  v-model="search" single-line hide-details append-inner-icon="mdi-magnify" @click="expandedSearch = true"
                  v-click-outside="{
                    handler: (e: MouseEvent) => expandedSearch = false
                  }" :class="[expandedSearch ? 'expand_search' : '', 'search mr-md-4']" />
              </template>
              <v-list v-if="searchedPosts.length">
                <v-list-item v-for="(item, index) in searchedPosts" :key="index" :value="index"
                  @click="handleChange(item.slug)">
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-switch v-model="darkTheme" hide-details class="mr-8" :label="` ${display.mdAndUp ? 'Dark theme' : ''}`" />
            <Auth :showDialog="showAuth" @closeDialog="showAuth = false; modalStore.removeModal()"
              @showForgetPasswordDialog="showForgetPassword = true" />
            <v-btn @click="showAuth = true" class="header-button mr-md-4" v-if="!userStore.userInfo">
              Sign in
            </v-btn>
            <SignUp :showDialog="showSignUp" @closeDialog="showSignUp = false; modalStore.removeModal()"
              :title="signUpTitle" @showResendLinkDialog="showResendLink = true"
              @showAuthDialog="showSignUp = false; showAuth = true" />
            <v-btn class="header-button" variant="text" @click="showSignUp = true" v-if="!userStore.userInfo">
              Sign up
            </v-btn>
            <v-btn prepend-icon="mdi-pencil" class="ml-5 header-button" variant="text" @click="openCreatePage()"
              v-if="userStore.userInfo">
              Write
            </v-btn>
            <v-menu v-if="userStore.userInfo">
              <template v-slot:activator="{ props }">
                <v-btn size="48" rounded variant="outlined" :ripple="false" class="mr-3 plain-custom-style"
                  v-bind="props">
                  <v-avatar>
                    <v-img v-if="userStore.userInfo.avatar" :src="userStore.userInfo.avatar"
                      :alt="userStore.userInfo.first_name + ' ' + userStore.userInfo.last_name" />
                    <span v-else>{{ userStore.userInfo.first_name[0] + userStore.userInfo.last_name[0] }}</span>
                  </v-avatar>
                </v-btn>
              </template>
              <v-list class="mx-auto" min-width="200px">
                <v-list-item link to="/profile">
                  <v-list-item-title>Profile</v-list-item-title>
                </v-list-item>
                <v-divider />
                <v-list-item @click="userStore.logout()">
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>

        <div v-if="!display.mdAndUp" class="additional-search mb-2">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-text-field v-bind="props" density="compact" variant="solo" label="Search" v-model="search" single-line
                hide-details append-inner-icon="mdi-magnify" />
            </template>
            <v-list v-if="searchedPosts.length">
              <v-list-item v-for="(item, index) in searchedPosts" :key="index" :value="index"
                @click="handleChange(item.slug)">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-app-bar>
      <v-main>
        <Notification />
        <v-container class="custom-container">
          <slot />
        </v-container>
      </v-main>
    </v-theme-provider>
  </v-app>
</template>

<script setup lang="ts">
import { useDisplay, useTheme } from "vuetify";
import { useModalsStore, useNotificationStore, useUserStore } from "~/store";

interface MenuItem {
  title: string;
  icon: string;
}

interface Article {
  content: string;
  created_at: string;
  description: string;
  id: number;
  image: string;
  slug: string;
  tags: string[];
  title: string;
  author_name: string;
  author_image: string;
}

interface SearchResult {
  count: number;
  results: Article[];
}

interface SuccessResponse {
  success: string;
}

const userStore = useUserStore();
userStore.getUserInfoFromLS();
const title: string = "Scihub";
const display = ref(useDisplay() || null);
let search: Ref<string> = ref('');
let darkTheme: Ref<boolean> = ref(false);
let showAuth: Ref<boolean> = ref(false);
let signUpTitle: Ref<string> = ref('');
let showSignUp: Ref<boolean> = ref(false);
let showForgetPassword: Ref<boolean> = ref(false);
let showResendLink: Ref<boolean> = ref(false);
let expandedSearch: Ref<boolean> = ref(false);
let searchedPosts: Ref<Article[]> = ref([]);

const theme = useTheme();

watch(darkTheme, () => {
  toggleTheme();
});

const fetchItems = async () => {
  const { data, error } = await useAPIFetch<Article[]>(`/api/posts/?search=${search.value}`);
  if (data.value) {
    searchedPosts.value = data.value;
  }
};

const modalStore = useModalsStore();

watch(() => modalStore.currentModal, (val) => {
  if (val) {
    if (val.name === 'SignUp') {
      signUpTitle.value = val.title;
      showSignUp.value = true;
    }
    if (val.name === 'Auth') {
      showAuth.value = true;
    }
  }
})

const debouncedFetchItems = useDebounce(fetchItems, 300);

watch(search, () => {
  debouncedFetchItems();
});

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
}

async function openCreatePage() {
  await navigateTo("/posts/create");
}

function handleChange(item: string | null) {
  search.value = '';
  navigateTo(`/posts/${item}`);
}

const route = useRoute()
if (route.query.token && route.name !== 'confirm-password') {
  const { data, error } = await useAPIFetch<SuccessResponse>(`/api/register/email-confirm/?activate=${route.query.token}`);
  if (data.value) {
    if (data.value.success) {
      const notifyStore = useNotificationStore();
      await notifyStore.setNotification({
        type: "success",
        message: data.value.success,
      });
    }
  }
  if (error.value) {
    console.error(error.value)
  }
}

</script>

<style lang="less" scoped>
@import "../assets/breakpoints.less";

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
</style>
