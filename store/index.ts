interface UserInfo {
  password: string;
  username: string;
}

interface RegisterInfo {
  email: string;
  username?: string;
  password: string;
  password_verifier: string;
}

interface TokenInfo {
  access: string;
  refresh: string;
}
export interface Notification {
  id: number;
  error: Error;
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
    async register(userData: RegisterInfo) {
      userData.username = userData.email;
      try {
        const { data } = await useAPIFetch("/api/register/", {
          method: "post",
          body: userData,
        });
        this.userData = data.value as TokenInfo;
      } catch (e) {
        console.error(e);
        return e;
      }
    },
    async login(userData: UserInfo) {
      try {
        const { data } = await useAPIFetch("/api/token/", {
          method: "post",
          body: userData,
        });
        this.userData = data.value as TokenInfo;
      } catch (e) {
        console.error(e);
        return e;
      }
    },
    logout() {
      this.userData = null;
    },
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
    setNotification(data: Error) {
      this.notifications.push({
        error: data,
        id: this.notifications.length
          ? this.notifications[this.notifications.length - 1].id + 1
          : 0,
      });
    },
    removeNotification(id: number) {
      this.notifications = this.notifications.filter((item) => item.id !== id);
    },
  },
});
