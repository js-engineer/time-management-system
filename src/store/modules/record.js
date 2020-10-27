import Api from '@/Api'

const state = {
};

const getters = {};

const actions = {
  getUserRecordList(_, data) {
    let url = `/record/list/${ data.userId }?pageNum=${ data.pageNum }&pageSize=${ data.pageSize }`
    url = data.from ? `${ url }&from=${ data.from }` : url
    url = data.to ? `${ url }&to=${ data.to }` : url
    return Api.get(url)
    .then((res) => {
      return { succeed: true, totalCounts: res.data.totalCounts, records: res.data.records }
    })
    .catch(err => {
     return { succeed: false, message: err.response.data.err || 'Unknown Error Occured.' }
    })
  },
  getRecordById(_, data) {
    return Api.get(`/record/${ data.id }`)
    .then((res) => {
      return { succeed: true, record: res.data.record }
    })
    .catch(err => {
      return { succeed: false, message: err.response.data.err || 'Unknown Error Occured.' }
    })
  },
  getRecordByUserAndDate(_, data) {
    return Api.get(`/record/by-date?user=${data.userId}&date=${data.date}`)
    .then((res) => {
      return { succeed: true, record: res.data.record }
    })
    .catch(err => {
      return { succeed: false, message: err.response.data.err || 'Unknown Error Occured.' }
    })
  },
  createRecord(_, data) {
    return Api.post(`/record`, data)
    .then((res) => {
      return { succeed: true, record: res.data.record }
    })
    .catch(err => {
      return { succeed: false, message: err.response.data.err || 'Unknown Error Occured.' }
    })
  },
  updateRecord(_, data) {
    return Api.put(`/record/${data.id}`, {
      notes: data.notes,
      hours: data.hours,
    })
    .then((res) => {
      return { succeed: true, record: res.data.record }
    })
    .catch(err => {
      return { succeed: false, message: err.response.data.err || 'Unknown Error Occured.' }
    })
  },
  deleteRecord(_, data) {
    return Api.delete(`/record/${data.id}`)
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
