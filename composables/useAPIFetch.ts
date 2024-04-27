import { useFetch } from '#app';
import { useNotificationStore, useUserStore } from '~/store';

export const useAPIFetch: typeof useFetch = (request, opts?) => {
  const config = useRuntimeConfig();
  const store = useUserStore();
  const notifyStore = useNotificationStore();
  const headers = {
    ...opts?.headers,
    authorization: store.userInfo ? `Bearer ${store.userInfo.access}` : ''
  };
  const customOptions = {
    ...opts,
    suspense: true,
    onError: (error: Error) => {
      notifyStore.setNotification({ type: 'error', message: error.message });
    }
  };
  return useFetch(request, {
    baseURL: config.public.baseURL,
    headers,
    ...customOptions,
    onResponse: async ({ response, options }) => {
      if (response.status === 401) {
        console.log(response);
        if (
          response._data.code === 'token_not_valid' &&
          !response._data.messages
        ) {
          await store.logout();
        }
        try {
          await store.rehydrate();
          if (store.userInfo?.access) {
            headers.authorization = `Bearer ${store.userInfo.access}`;
            useAPIFetch(request, customOptions);
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      }
    }
  });
};
