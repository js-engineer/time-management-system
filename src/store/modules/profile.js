import Api from '@/Api'

const state = {
};

const getters = {};

const actions = {
  changePassword(_, data) {
    return Api.put(`/profile/password`, data)
    .then(() => {
      return { succeed: true }
    })
    .catch(err => {
     return { succeed: false, message: err.response.data.err || 'Unknown Error Occured.' }
    })
  },
  updateSettings({ commit }, data) {
    return Api.put(`/profile/settings`, data)
    .then((res) => {
      commit('auth/setUser', res.data.user, { root: true })
      return { succeed: true }
    })
    .catch(err => {
     return { succeed: false, message: err.response.data.err || 'Unknown Error Occured.' }
    })
  },
  closeAccount() {
    return Api.delete(`/profile`)
    .then(() => {
      return { succeed: true }
    })
    .catch(err => {
     return { succeed: false, message: err.response.data.err || 'Unknown Error Occured.' }
    })
  },
};

const mutations = {
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
