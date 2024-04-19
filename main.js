import App from "./App";
import uView from "uview-ui";
import store from "./store";
Vue.use(uView);
import api from "@/common/api.js";
import common from "./common/common";
// 引入工具函数
Vue.prototype.$api = api;
Vue.prototype.$store = store;
Vue.prototype.$limitInputNumber = common.limitInputNumber;
Vue.prototype.$limitPhone = common.limitPhone;
console.log(uni.$u.props);
console.log(uni.$u.config.v);
console.log(uni.$u);
uni.getSystemInfo({
	success: res => {
		console.log(res);
		if (res.screenWidth > 500) {
			Vue.prototype.$isIpad = true;
			uni.$u.setConfig({
				// 修改$u.config对象的属性
				config: {
					// 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
					unit: "rpx"
				},
				// 修改$u.props对象的属性
				props: {
					// 修改radio组件的size参数的默认值，相当于执行 uni.$u.props.radio.size = 30
					radio: {
						size: 30
					},
					checkboxGroup: {
						size: 36
					},
					swiper: {
						height: 262,
					},
					navbar: {
						height: "88rpx",
						titleWidth: "800rpx"
					},
					icon: {
						size: "36rpx",
						labelSize: "30rpx"
					},
					avatar: {
						size: 80
					},
					scrollList: {
						indicatorBarWidth: 40,
						indicatorWidth: 120
					},
					tabs: {
						itemStyle: () => { return { height: "88rpx", padding: "0 11rpx" }; },
						lineWidth: 40,
						lineHeight: 6
					},
					empty: {
						height: 320,
						iconSize: 180,
						width: 320
					}
				}
			});
		}

	}
});

import Vue from "vue";
Vue.config.productionTip = false;
App.mpType = "app";

// 压缩表格数据插件
import utils from "@/common/util.js";
Vue.prototype.utils = utils;
import { menuPerm } from "./common/menuArr.js";
Vue.prototype.$menuPerm = menuPerm;
import { checkName } from "./common/common.js";
Vue.prototype.$checkName = checkName;
// 按钮权限控制方法
const auth = {
	install(Vue) {
		Vue.mixin({
			methods: {
				$auth(value) {
					let isExist = false;
					// 从浏览器缓存中获取权限数组（该数组在登入成功后拉取用户的权限信息时保存在浏览器的缓存中）
					const buttonpermsStr = uni.getStorageSync("user").permissions;
					if (buttonpermsStr == undefined || buttonpermsStr == null) {
						return false;
					}
					if (buttonpermsStr.indexOf(value) >= 0) {
						// 若在按钮中定义的权限字段能在后端返回的权限数组中能找到，则该按钮可显示
						isExist = true;
					}
					return isExist;
				},
			},
		});
	},
};

Vue.use(auth);

// 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
const app = new Vue({
	store,
	...App
});
app.$mount();