import Api from '@/Api'

const state = {
};

const getters = {};

const actions = {
  getUserList(_, data) {
    return Api.get(`/user/list?pageNum=${ data.pageNum }&pageSize=${ data.pageSize }`)
    .then((res) => {
      return { succeed: true, totalCounts: res.data.totalCounts, users: res.data.users }
    })
    .catch(err => {
     return { succeed: false, message: err.response.data.err || 'Unknown Error Occured.' }
    })
  },
  getUserById(_, data) {
    return Api.get(`/user/${ data.id }`)
    .then((res) => {
      return { succeed: true, user: res.data.user }
    })
    .catch(err => {
      return { succeed: false, message: err.response.data.err || 'Unknown Error Occured.' }
    })
  },
  createUser(_, data) {
    return Api.post(`/user`, data)
    .then((res) => {
      return { succeed: true, user: res.data.user }
    })
    .catch(err => {
      return { succeed: false, message: err.response.data.err || 'Unknown Error Occured.' }
    })
  },
  updateUser(_, { id, name, email, password, preferredHours, role}) {
    const data = { name, email, preferredHours, role }
    if (password) {
      data.password = password
    }
    return Api.put(`/user/${id}`, data)
    .then((res) => {
      return { succeed: true, user: res.data.user }
    })
    .catch(err => {
      return { succeed: false, message: err.response.data.err || 'Unknown Error Occured.' }
    })
  },
  deleteUser(_, data) {
    return Api.delete(`/user/${data.id}`)
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
