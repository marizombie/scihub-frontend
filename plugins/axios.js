// plugins/axios.js

// expose the store, axios client and redirect method from the Nuxt context
// https://nuxtjs.org/api/context/
export default function ({ store, app: { $axios }, redirect }) {
  $axios.onRequest((config) => {
    // check if the user is authenticated
    if (store.getters.userInfo) {
      // set the Authorization header using the access token
      config.headers.Authorization = 'Bearer ' + store.getters.userInfo.access
    }

    return config
  })
}