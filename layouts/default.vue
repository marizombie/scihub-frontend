<template>
  <v-app>
    <v-app-bar fixed app class="header d-flex flex-column">
      <div class="main-content">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-menu" v-bind="props"></v-btn>
          </template>
          <v-list>
            <v-list-item v-for="item in items" :key="item.title" link>
              <template v-slot:prepend>
                <v-icon :icon="item.icon"></v-icon>
              </template>
              <v-list-item-title v-text="item.title" />
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="px-2" link to="/profile" prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg">
              <v-list-item-title>John Leider</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-app-bar-title>
          <NuxtLink to="/">{{ title }}</NuxtLink>
        </v-app-bar-title>
        <div class="d-flex align-center ml-auto">
          <v-text-field density="compact" variant="solo" v-if="display.mdAndUp" label="Search" v-model="search"
            single-line hide-details append-inner-icon="mdi-magnify" class="search mr-md-4" />
          <v-switch v-model="darkTheme" hide-details class="mr-8" :label="` ${display.mdAndUp ? 'Dark theme' : ''}`" />
          <Auth :showDialog="showAuth" @closeDialog="showAuth = false" />
          <v-btn @click="showAuth = true" class="header-button mr-md-4" v-if="!userStore.userInfo">
            Sign in
          </v-btn>
          <SignUp :showDialog="showSignUp" @closeDialog="showSignUp = false" />
          <v-btn class="header-button" variant="text" @click="showSignUp = true" v-if="!userStore.userInfo">
            Sign up
          </v-btn>
          <v-btn class="ml-5 header-button" variant="text" @click="userStore.logout()" v-if="userStore.userInfo">
            Log out
          </v-btn>
        </div>
      </div>

      <div v-if="!display.mdAndUp" class="additional-search mb-2">
        <v-text-field density="compact" variant="solo" label="Search" v-model="search" single-line hide-details
          append-inner-icon="mdi-magnify" />
      </div>
    </v-app-bar>
    <v-main>
      <Notification />
      <v-container class="custom-container">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useDisplay, useTheme } from "vuetify";
import { useNotificationStore, useUserStore } from "~/store";

const userStore = useUserStore();
const title: string = "Scihub";
const display = ref(useDisplay() || null);
let search: Ref<string> = ref("");
let darkTheme: Ref<boolean> = ref(false);
let showAuth: Ref<boolean> = ref(false);
let showSignUp: Ref<boolean> = ref(false);
const items = [
  { title: "Bookmarks", icon: "mdi-bookmark" },
  { title: "My Articles", icon: "mdi-text-box-multiple" },
  { title: "Settings", icon: "mdi-cog" },
];

const theme = useTheme();

watch(darkTheme, () => {
  toggleTheme();
});

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
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
}

.header-button {
  font-weight: 700;
}
</style>
