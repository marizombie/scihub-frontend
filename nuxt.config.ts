import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Great Things Development'
    }
  },
  build: {
    transpile: ['vuetify']
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@vee-validate/nuxt',
    'nuxt-lodash',
    '@vueuse/nuxt',
    '@nuxt/image',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    }
  ],
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || 'http://localhost:8000/'
    }
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls
      }
    }
  },
  pinia: {
    autoImports: ['defineStore', ['defineStore', 'definePiniaStore']]
  }
});
