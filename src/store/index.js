import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import record from './modules/record'

Vue.use(Vuex)

export default new Vuex.Store({
	getters: {},
	modules: {
		auth,
		record,
	},
	strict: true
})
