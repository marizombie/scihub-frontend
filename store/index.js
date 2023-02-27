import { ActionTree, MutationTree, GetterTree } from 'vuex';
import axios from 'axios'

export const state = () => ({
  userInfo: {},
});

export const mutations = {
  users(state, users) {
    state.users = users;
  },
};

export const actions = {
  async register({commit}, { username, password }) {
    try {
      const IP = await this.$axios.$post("/api/register/", {
        username,
        password,
        password_verifier: password
      })
      console.log(IP)
      // commit('SET_IP', IP)
    } catch(e) {
      alert(e)
    }
  }

  // fetchUsers({ commit }) {
  //   return api.accounts.all().then((users) => {
  //     commit('users', users.items);
  //     return users.items;
  //   });
  // },
  // fetchPublishers({ rootState, commit }) {
  //   let canViewAllPublishers =
  //     rootState.user.info &&
  //     [Accounts.Role.SystemAdmin].includes(rootState.user.info.role);
  //   if (!canViewAllPublishers) {
  //     return api.publishers.get('self').then((publisher) => {
  //       let publisherArr = [];
  //       publisherArr.push(publisher);
  //       commit('publishers', publisherArr);
  //       return publisherArr;
  //     });
  //   }
  //   return api.publishers.all({}).then((publishers) => {
  //     commit('publishers', publishers.items);
  //     return publishers.items;
  //   });
  // },
};

export const getters = {
  // publishersAsItems: (state) =>
  //   state.publishers
  //     .map((publisher) => ({
  //       text: publisher.name,
  //       value: publisher.id,
  //       enabled: publisher.isEnabled,
  //       currency: publisher.currency
  //     }))
  //     .sort(sortByProp('text')),
};