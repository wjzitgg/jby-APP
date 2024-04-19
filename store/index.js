import Vue from "vue";
import Vuex from "vuex";
import api from '../common/api';
Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		userInfo: {},
		phone: "",
		token: "",
		settingPkId: "",
		routes: {},
		esign: false,
		cert: false,
		recert: false,
		loginFace: false,
		bindData: {},
		accountParams: {},
		goSelect: false,
		isSign: false,
		busCert:false,
		contentSign:false,
		getPro:false,
		approveSign:false,
		todo:false,
		impower:false,
		enterAuth:false,
		nodeData: {},
		dictionariesData:[],
		approveStatusList:{0:'草稿',1:'审批中',2:'审批完成' , 3:'验收流程审批不通过',4:'待签章',5:'签章中',6:'签章已完成',7:'已撤回'}
	},

	getters: {},
	mutations: {
		saveUserInfo(state, data) {
			state.userInfo = data;
		},
		saveSettingPkId(state, data) {
			state.settingPkId = data;
		},
		saveRoutes(state, data) {
			state.routes = data;
		},
		isEsign(state, data) {
			state.esign = data;
		},
		isCert(state, data) {
			state.cert = data;
		},
		isEnterAuth(state, data) {
			state.enterAuth = data;
		},
		isReCert(state, data) {
			state.recert = data;
		},
		isLoginFace(state, data) {
			state.loginFace = data;
		},
		saveBindData(state, data) {
			state.bindData = data;
		},
		saveGetAccountParams(state, data) {
			state.accountParams = data;
		},
		saveGoSelect(state, date) {
			state.goSelect = date;
		},
		saveIsSign(state, date) {
			state.isSign = date;
		},
		saveBusCert(state, date) {
			state.busCert = date;
		},
		saveContentSign(state, date){
			state.contentSign=date
		},
		saveGetPro(state, date){
			state.getPro=date
		},
		saveApproveSign(state, date){
			state.approveSign=date
		},
		saveTodo(state, date){
			state.todo=date
		},
		saveImpower(state, date){
			state.impower=date
		},
		isCerEsign(state, date){
			state.cerEsign=date
		},
		cleanDictionariesData(state){
			state.dictionariesData=[]
		},
		cleanAllStore(state) {
			state.userInfo= {}
			state.settingPkId= ""
			state.routes= {}
			state.esign= false
			state.cert= false
			state.loginFace= false
			state.bindData= {}
			state.accountParams= {}
			state.goSelect= false
			state.isSign= false
			state.busCert=false
			state.contentSign=false
			state.nodeData= {}
			state.getPro=false
			state.approveSign=false
			state.todo=false
			state.impower=false
			state.dictionariesData=[]
			state.recert=false
			state.enterAuth=false
			state.cerEsign=false
		},
	},
	actions: {
		// 异步调用
		getDictionariesData(context, num) {
		  // 请求接口
		  if (store.state.dictionariesData.length) {
			return store.state.dictionariesData.filter(item => item.dictType === num)[0].sysDictList;
		  } else {
			return new Promise(resolve => {
			  api.findDictAllList().then(res => {
				if (res.code === 200) {
				  store.state.dictionariesData=res.data
				  resolve(res.data.filter(item => item.dictType === num)[0].sysDictList);
				}
			  });
			  // context.commit("modificationDictionary", result);
			});
		  }
		}
	  },
});
export default store;
