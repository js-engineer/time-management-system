import Api from '@/Api'

const state = {
  user: null,
};

const getters = {};

const actions = {
  register(_, data) {
    return Api.post(`/auth/register`, data)
    .then(() => {
      return { succeed: true }
    })
    .catch(err => {
      return { succeed: false, message: err.response.data.err || 'Unknown Error Occured.' }
    })
  },
  login({ commit }, data) {
    return Api.post(`/auth/login`, data)
    .then((res) => {
      localStorage.setItem('token', res.data.token)
      commit('setUser', res.data.user)
      return { succeed: true }
    })
    .catch(err => {
      return { succeed: false, message: err.response.data.err || 'Unknown Error Occured.' }
    })
  },
  verifyEmail(_, data) {
    return Api.post(`/auth/verify-email`, data)
    .then(() => {
      return { succeed: true }
    })
    .catch(err => {
      return { succeed: false, message: err.response.data.err || 'Unknown Error Occured.' }
    })
  },
  checkToken({ commit }) {
    return Api.get(`/auth/check-token`)
    .then((res) => {
      commit('setUser', res.data.user)
      return { succeed: true }
    })
    .catch(err => {
      return { succeed: false, message: err.response.data.err || 'Unknown Error Occured.' }
    })
  }
};

const mutations = {
  setUser(state, data) {
    state.user = data
  },
  logout(state) {
    localStorage.clear()
    state.user = null
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
