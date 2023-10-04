import { useFetch } from "#app";
import { useUserStore } from "~/store";

export const useAPIFetch: typeof useFetch = (request, opts?) => {
  const config = useRuntimeConfig();
  const store = useUserStore();
  const headers = {
    ...opts?.headers,
    authorization: store.userInfo ? `Bearer ${store.userInfo.access}` : "",
  };
  return useFetch(request, {
    baseURL: config.public.baseURL,
    headers,
    ...opts,
  });
};
