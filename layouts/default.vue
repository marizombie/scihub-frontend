<template>
  <v-app dark>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      class="header d-flex flex-column"
    >
      <div class="main-content">
        <v-menu>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="item in items"
              :key="item.title"
              link
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item class="px-2" link to="/profile">
            <v-list-item-avatar>
              <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
            </v-list-item-avatar>
            <v-list-item-title>John Leider</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-toolbar-title>
          <NuxtLink to="/">{{ title }}</NuxtLink>
        </v-toolbar-title>
        <div class="d-flex align-center ml-auto">
          <v-text-field
            v-if="$vuetify.breakpoint.mdAndUp"
            dense
            label="Search"
            v-model="search"
            solo
            hide-details
            append-icon="mdi-magnify"
            class="mr-md-16"
          />
          <v-switch
            v-model="darkTheme"
            :label="$vuetify.breakpoint.mdAndUp ?  'Dark theme' : ''"
            color="indigo darken-3"
            class="mr-8"
            hide-details
          ></v-switch>
          <Auth :showDialog="showAuth" @closeDialog="showAuth = false"/>
          <v-btn text @click="showAuth = true" class="mr-md-4" v-if="!$store.getters.userInfo">
            Sign in
          </v-btn>
          <SignUp :showDialog="showSignUp" @closeDialog="showSignUp = false"/>
          <v-btn text @click="showSignUp = true" v-if="!$store.getters.userInfo">
            Sign up
          </v-btn>
          <v-btn text @click="logout" v-if="$store.getters.userInfo">
            Log out
          </v-btn>
        </div>
      </div>
      
      <div v-if="!$vuetify.breakpoint.mdAndUp" class="additional-search">
        <v-text-field
           dense
           label="Search"
           v-model="search"
           solo
           hide-details
           append-icon="mdi-magnify"
        />
      </div>
    </v-app-bar>
    <v-main>
      <v-container class="custom-container">
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Auth from '~/components/Auth.vue';
import SignUp from '~/components/SignUp.vue';
export default {
  components: {
    Auth,
    SignUp
  },
  name: 'DefaultLayout',
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      darkTheme: false,
      showAuth: false,
      showSignUp: false,
      isUserLogin: true,
      title: 'Scihub',
      search: '',
      items: [
          { title: 'Bookmarks', icon: 'mdi-bookmark' },
          { title: 'My Articles', icon: 'mdi-text-box-multiple' },
          { title: 'Settings', icon: 'mdi-cog' },
        ],
      mini: true
    }
  },
  watch: {
    darkTheme(val) {
      this.$vuetify.theme.dark = val;
    }
  },
  methods: {
    async logout() {
      await this.$store.commit("logout")
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/breakpoints.less';

.header {
  height: 56px!important;
  @media (max-width: @sm-min) {
    height: 106px!important;
  }
  ::v-deep {
    .v-toolbar__content {
      height: 56px!important;
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
      
    }
  }
  a.nuxt-link-active {
    font-weight: bold;
    color: inherit;
    text-decoration: none;
  }
  .additional-search {
    width: 94%;
  }
}

::v-deep {
  .custom-container {
    @media (max-width: @md-max) {
      max-width:100%;
    }
  }
  .v-main {
     @media (max-width: @sm-min) {
      padding-top: 106px!important;
     }
  }
}
</style>
