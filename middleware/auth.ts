import { useModalsStore, useUserStore } from '~/store';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useUserStore();
  await user.getUserInfoFromLS();
  if (!user.userInfo) {
    const modalStore = useModalsStore();
    let returnPath;
    if (to.path === from.path) {
      returnPath = '/';
    } else {
      returnPath = from.path;
    }
    await modalStore.setModal('Auth', '', returnPath);
    return;
  }
});
