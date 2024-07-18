// import { useFetch } from '#app';
import { useNotificationStore, useUserStore } from '~/store';

export const useAPIFetch: typeof useLazyFetch = (request, opts?) => {
  const config = useRuntimeConfig();
  const store = useUserStore();
  const notifyStore = useNotificationStore();
  const headers = {
    ...opts?.headers,
    apikey: config.public.apiKey || '',
    api_client_name: config.public.apiClientName || '',
    referrer:  config.public.baseURL
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
    credentials: 'include',
    ...customOptions,
    onResponse: async ({ response, options }) => {
      if (response.status === 401) {
        if (
          response._data.code === 'token_not_valid' &&
          response._data.detail ===
            'No valid token found in refresh token cookie'
        ) {
          await store.logout();
        } else {
          try {
            await store.rehydrate();
            if (store.userInfo) {
              useAPIFetch(request, customOptions);
            }
          } catch (error) {
            console.error('Token refresh failed:', error);
          }
        }
      }
    }
  });
};
