// 环境的切换
let baseUrl = "";
if (process.env.NODE_ENV === "development") {
	baseUrl = "http://192.168.2.16:9199"; //测试环境
	// baseUrl = "http://192.168.2.16:19199"; //bug开发环境
	// baseUrl = "http://192.168.2.16:39199"; //dev开发环境
	// baseUrl = "http://192.168.2.16:29199"; //dev开发环境
} else if (process.env.NODE_ENV === "production") {
	baseUrl = "http://192.168.2.16:9199"; //测试环境接口
	// baseUrl = "http://192.168.2.16:29199"; //dev开发环境接口
	// baseUrl = "http://192.168.2.16:19199"; //bug
	// baseUrl = "https://erp.jianwangkeji.cn/gateway"; //生产环境接口
}
// 部分h5地址使用，如预览pdf，盖章等页面
let h5Url = "";
if (baseUrl.indexOf("https://erp.jianwangkeji.cn") != -1) {
	h5Url = "https://erp.jianwangkeji.cn";
} else {
	h5Url = "http://192.168.2.16";
}
import store from "../store";
const request = (options = {}, sendToken) => {
	// 在这里可以对请求头进行一些设置
	if (options.type === "DELETE") {
		options.headers = {
			"Content-Type": "application/x-www-form-urlencoded",
		};
	} else {
		options.headers = {
			"Content-Type": "application/json;charset=utf-8",
		};
	}
	const token = uni.getStorageSync("token") ?
		uni.getStorageSync("token") :
		uni.getStorageSync("token");
	let noTokenUrl = ["/app/public/judgeBusinessSuccess"];
	if (noTokenUrl.includes(options.url)) {
		options.headers.Authorization = "";
	} else {
		if (token !== "" && token !== "null" && token !== "undefined") {
			options.headers.Authorization = token;
		}
		if (sendToken) {
			options.headers.Authorization = sendToken;
		}
	}
	return new Promise((resolve, reject) => {
		uni
			.request({
				url: baseUrl + options.url || "",
				method: options.type || "GET",
				data: options.data || {},
				header: options.headers || {},
			})
			.then(data => {
				let [err, res] = data;
				if (res) {
					if (res.statusCode === 500 || res.statusCode === 404) {
						return uni.showToast({
							icon: "error",
							title: "系统内部错误",
							duration: 2000,
						});
					}
					if (res.data.code !== 200) {
						if (
							res.data.code === 506 ||
							res.data.code === 500 ||
							res.data.code === 507 ||
							res.data.code === 501 ||
							res.data.code === 509
						) {
							uni.showToast({
								icon: "error",
								title: "系统内部错误",
								duration: 2000,
							});
							reject(res.data);
							return;
						} else if (
							res.data.code === 503 ||
							res.data.code === 504 ||
							res.data.code === 510
						) {
							// 登录失效
							uni.reLaunch({ url: "/pages/login/login" });
							uni.showToast({
								icon: res.data.code === 510 ? "none" : "error",
								title: res.data.msg,
								duration: 2000,
							});
							uni.removeStorage({
								key: "token",
							});
							uni.removeStorage({
								key: "routes",
							});
							store.commit("saveUserInfo", {});
							return;
						} else {
							uni.showToast({
								icon: "none",
								title: res.data.msg,
								duration: 2000,
							});
						}
					}
					resolve(res.data);
				}
				if (err) {
					uni.showToast({ icon: "error", title: "服务器错误", duration: 2000 });
					reject(err);
				}
			})
			.catch(error => {
				reject(error);
			});
	});
};

const get = (url, data, token, options = {}) => {
	options.type = "GET";
	options.data = data;
	options.url = url;
	return request(options, token);
};

const post = (url, data, token, options = {}) => {
	options.type = "POST";
	options.data = data;
	options.url = url;
	return request(options, token);
};

const put = (url, data, token, options = {}) => {
	options.type = "PUT";
	options.data = data;
	options.url = url;
	return request(options, token);
};

const deleter = (url, data, token, options = {}) => {
	options.type = "DELETE";
	options.data = data;
	options.url = url;
	return request(options, token);
};

export default {
	get,
	post,
	put,
	deleter,
	baseUrl,
	h5Url,
};