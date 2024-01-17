export interface RefreshInfo {
  access: string;
}
export interface TokenInfo {
  access: string;
  refresh: string;
  avatar: string;
  first_name: string;
  last_name: string;
  username?: string;
}

export interface Notification {
  id?: number;
  type: "error" | "info" | "success";
  message: string;
}

export interface Modal {
  name: string;
  title: string;
  prevRoute: string;
}

function parseJwt (token: string | undefined) {
  if (!token) {
    return;
  }
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      userData: null as null | TokenInfo,
    };
  },
  getters: {
    userInfo: (state) => state.userData,
  },
  actions: {
    async setUserInfo(token: TokenInfo) {
      this.userData = token;
      localStorage.setItem("token", token.access);
      localStorage.setItem("refreshToken", token.refresh);
      localStorage.setItem("user", [token.avatar, token.first_name, token.last_name].join(';'))
    },
    async getUserInfoFromLS() {
     let token = localStorage.getItem("token");
     let refreshToken = localStorage.getItem("refreshToken");
     let user = localStorage.getItem("user")?.split(';');
     if (token && refreshToken && user) {
      this.userData = {
        access: token,
        refresh: refreshToken,
        avatar: user[0],
        first_name: user[1],
        last_name: user[2]
      }
      this.rehydrate()
     }
    },
    setUserName(value: string) {
      if ( this.userData ) {
        this.userData.username = value;
      }
    },
    setUserAvatar(value: string) {
      if ( this.userData ) {
        this.userData.avatar = value;
      }
    },
    logout() {
      this.userData = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    async rehydrate() {
      let tokenInfo = parseJwt(localStorage.getItem("token") || this.userData?.access);
      if ( tokenInfo ) {
        const expiredTime = tokenInfo.exp * 1000;
        if (expiredTime < new Date().getTime()) {
          this.logout()
        } else {
          const { data, error } = await useAPIFetch<RefreshInfo>("/api/refresh_token/", {
            method: "post",
            body: { refresh: localStorage.getItem("refreshToken") || this.userData?.refresh},
          });
          if (error.value) {
            const notifyStore = useNotificationStore();
            await notifyStore.setNotification({
              type: "error",
              message: error.value.data.detail,
            });
          }
          if (data.value) {
            this.userData!.access = data.value.access;
            localStorage.setItem("token", data.value.access);
          }
        }
      }
    }
  },
});

export const useNotificationStore = defineStore("notification", {
  state: () => {
    return {
      notifications: [] as Notification[],
    };
  },
  getters: {
    notificationsArray: (state) => state.notifications,
  },
  actions: {
    setNotification(data: Notification) {
      this.notifications.push({
        type: data.type,
        message: data.message,
        id: this.notifications.length && this.notifications[this.notifications.length - 1].id
          ? this.notifications[this.notifications.length - 1].id! + 1
          : 0,
      });
    },
    removeNotification(id: number) {
      this.notifications = this.notifications.filter((item) => item.id !== id);
    },
  },
});

export const useModalsStore = defineStore("modal", {
  state: () => {
    return {
      currentModal: null as null | Modal,
    };
  },
  getters: {
    curModal: (state) => state.currentModal,
  },
  actions: {
    setModal(modalName: string, additionalData: any, prevRoute: string) {
      this.currentModal = {
        name: modalName,
        title: additionalData || '',
        prevRoute: prevRoute
      }
    },
    removeModal() {
      this.currentModal = null;
    },
  },
});
