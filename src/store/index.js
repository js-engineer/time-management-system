import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import record from './modules/record'
import user from './modules/user'

Vue.use(Vuex)

export default new Vuex.Store({
	getters: {},
	modules: {
		auth,
		record,
		user,
	},
	strict: true
})
