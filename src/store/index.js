import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
		appInfoId:"18"  //app对应的id
	},
  mutations: {
    setAppInfoId(state,val){
      state.appInfoId = val;
    }
  },
  actions: {

	},
  getters: {
		appId: state => {
			return state.appInfoId
		},
	},
  modules: {}
});
