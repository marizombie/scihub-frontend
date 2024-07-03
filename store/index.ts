import type { CookiesAccepts } from '~/types';

export interface RefreshInfo {
  access: string;
}
export interface TokenInfo {
  avatar: string;
  first_name: string;
  last_name: string;
  username?: string;
}

export interface Notification {
  id?: number;
  type: 'error' | 'info' | 'success';
  message: string;
}

export interface Modal {
  name: string;
  title: string;
  prevRoute: string;
}

function parseJwt(token: string | undefined | null) {
  if (!token) {
    return;
  }
  if (import.meta.server) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  }
  if (import.meta.client) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
}

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userData: null as null | TokenInfo
    };
  },
  getters: {
    userInfo: (state) => state.userData,
    userAvatar: (state) => state.userData?.avatar
  },
  actions: {
    async setUserInfo(token: TokenInfo) {
      this.userData = token;
    },
    async getUserInfoFromLS() {
      const csrf = useCookie('csrftoken');
      const access = useCookie('Secure-great-base');
      const refresh = useCookie('Secure-great-refresh');
      const avatar = useCookie('avatar');
      const first_name = useCookie('first_name');
      const last_name = useCookie('last_name');
      const username = useCookie('username');
      if (access.value && refresh.value && csrf.value) {
        this.userData = {
          avatar: avatar.value || '',
          first_name: first_name.value || '',
          last_name: last_name.value || '',
          username: username.value || ''
        };
        await this.rehydrate();
      }
    },
    setUserName(value: string) {
      if (this.userData) {
        this.userData.username = value;
        this.setUserInfo(this.userData);
      }
    },
    setUserAvatar(value: string) {
      if (this.userData) {
        this.userData.avatar = value;
        this.setUserInfo(this.userData);
      }
    },
    async logout() {
      // rewrite to request below WITHOUT USING USEAPIFETCH after https://great-things.atlassian.net/browse/CNS-365
      // and remove useCookies from here

      // const { error } = await useAPIFetch<RefreshInfo>(
      //   '/api/logout/',
      //   {
      //     method: 'post',
      //   }
      // );
      // if (error.value) {
      //   const notifyStore = useNotificationStore();
      //   await notifyStore.setNotification({
      //     type: 'error',
      //     message:error.value.toString()
      //   });
      // }
      const csrf = useCookie('csrftoken');
      const access = useCookie('Secure-great-base');
      const refresh = useCookie('Secure-great-refresh');
      const avatar = useCookie('avatar');
      const first_name = useCookie('first_name');
      const last_name = useCookie('last_name');
      const username = useCookie('username');
      csrf.value = null;
      access.value = null;
      refresh.value = null;
      avatar.value = null;
      first_name.value = null;
      last_name.value = null;
      username.value = null;
      this.userData = null;
    },
    async rehydrate() {
      const accessToken = useCookie('Secure-great-base');
      const refresh = useCookie('Secure-great-refresh');
      let tokenInfo = parseJwt(accessToken.value);
      if (tokenInfo && refresh.value) {
        const expiredTime = tokenInfo.exp * 1000;
        if (expiredTime < new Date().getTime()) {
          const { data, error } = await useAPIFetch<RefreshInfo>(
            '/api/refresh_token/',
            {
              method: 'post',
              body: {
                refresh: refresh.value
              }
            }
          );
          if (error.value && import.meta.server) {
            const notifyStore = useNotificationStore();
            await notifyStore.setNotification({
              type: 'error',
              message: 'Please sign in again to continue your session'
            });
            this.logout();
          }
          if (data.value) {
            accessToken.value = data.value.access;
          }
        }
      }
    }
  }
});

export const useNotificationStore = defineStore('notification', {
  state: () => {
    return {
      notifications: [] as Notification[]
    };
  },
  getters: {
    notificationsArray: (state) => state.notifications
  },
  actions: {
    setNotification(data: Notification) {
      const dataObject = {
        type: data.type,
        message: data.message,
        id:
          this.notifications.length &&
          this.notifications[this.notifications.length - 1].id
            ? this.notifications[this.notifications.length - 1].id! + 1
            : 0
      };
      this.notifications.push(dataObject);
      this.removeNotificationDelayed(dataObject.id, 5000);
    },
    removeNotificationDelayed(id: number, delay: number) {
      setTimeout(() => {
        this.notifications = this.notifications.filter(
          (item) => item.id !== id
        );
      }, delay);
    }
  }
});

export const useModalsStore = defineStore('modal', {
  state: () => {
    return {
      currentModal: null as null | Modal
    };
  },
  getters: {
    curModal: (state) => state.currentModal
  },
  actions: {
    setModal(modalName: string, additionalData: any, prevRoute?: string) {
      this.currentModal = {
        name: modalName,
        title: additionalData || '',
        prevRoute: prevRoute ? prevRoute : ''
      };
    },
    removeModal() {
      this.currentModal = null;
    }
  }
});

export const useCookiesStore = defineStore('cookiesStore', {
  state: () => {
    return {
      currentAccepts: null as null | CookiesAccepts
    };
  },
  getters: {
    getCurrentAccepts: (state) => state.currentAccepts
  },
  actions: {
    setCurrentAccepts(accepts: CookiesAccepts) {
      this.currentAccepts = accepts;
      if (import.meta.client) {
        localStorage.setItem('cookiesAccepts', JSON.stringify(accepts));
      }
    },
    rehydrateCurrentAccepts() {
      if (import.meta.client) {
        const accepts = localStorage.getItem('cookiesAccepts');
        if (accepts) {
          this.currentAccepts = JSON.parse(accepts);
        } else {
          this.currentAccepts = null;
        }
      }
    }
  }
});
