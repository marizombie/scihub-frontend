export const state = () => ({
  userInfo: null,
});

export const mutations = {
  setUser(state, user) {
    state.userInfo = user;
  },
  logout(state) {
    state.userInfo = null;
  }
};

export const actions = {
  async register({commit}, userData) {
    try {
      userData.password_verifier = userData.password;
      const data = await this.$axios.$post("/api/register/", userData)
      commit("setUser", jwtDecode(data.access))
    } catch(e) {
      console.error(e)
      return e;
    }
  },
  async login({commit}, userData) {
    try {
      const data = await this.$axios.$post("/api/token/", userData)
      commit("setUser", data)
    } catch(e) {
      console.error(e)
      return e;
    }
  }
};

export const getters = {
  userInfo: (state) => state.userInfo,
};