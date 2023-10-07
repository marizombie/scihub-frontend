// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: ["@invictus.codes/nuxt-vuetify", "@pinia/nuxt", "@nuxtjs/i18n"],
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || "http://127.0.0.1:8000/",
    },
  },
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: "customLight",
        themes: {
          customDark: {
            dark: true,
            colors: {
              primary: "#1976D2",
              accent: "#424242",
              secondary: "#FF8F00",
              info: "#26A69A",
              warning: "#FFC107",
              error: "#DD2C00",
              success: "#00E676",
            },
          },
          customLight: {
            dark: false,
            colors: {
              primary: "#9C27B0",
              secondary: "#757575",
              accent: "#000000",
              error: "#FF1744",
            },
          },
        },
      },
      defaults: {},
    },

    moduleOptions: {
      treeshaking: true,
      useIconCDN: true,
      styles: true,
      autoImport: true,
      useVuetifyLabs: true,
    },
  },
  pinia: {
    autoImports: ["defineStore", ["defineStore", "definePiniaStore"]],
  },
});
