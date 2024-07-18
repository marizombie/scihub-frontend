import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  debug: true,
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
    '@nuxtjs/critters',
    ['@nuxtjs/robots', { disallow: ['/posts/create', '/profile'] }],
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    }
  ],
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || 'http://localhost:8000/',
      authToken: process.env.JWT_AUTH_COOKIE || undefined,
      refreshToken: process.env.JWT_AUTH_REFRESH_COOKIE || undefined,
      apiKey: process.env.API_KEY || undefined,
      apiClientName: process.env.API_CLIENT_NAME || undefined
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
  },
  compatibilityDate: '2024-07-04'
});
