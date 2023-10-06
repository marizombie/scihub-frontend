import { useFetch } from "#app";
import { useNotificationStore, useUserStore } from "~/store";

export const useAPIFetch: typeof useFetch = (request, opts?) => {
  const config = useRuntimeConfig();
  const store = useUserStore();
  const notifyStore = useNotificationStore();
  const options = {
    ...opts,
    suspense: true,
    onError: (error: Error) => notifyStore.setNotification(error),
  };
  const headers = {
    ...opts?.headers,
    authorization: store.userInfo ? `Bearer ${store.userInfo.access}` : "",
  };
  return useFetch(request, {
    baseURL: config.public.baseURL,
    headers,
    ...options,
  });
};
