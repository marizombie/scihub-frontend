export interface TokenInfo {
  access: string;
  refresh: string;
}
export interface NotificationWOID {
  type: "error" | "info";
  message: string;
}

export interface Notification {
  id: number;
  type: "error" | "info";
  message: string;
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
    setNotification(data: NotificationWOID) {
      this.notifications.push({
        type: data.type,
        message: data.message,
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
