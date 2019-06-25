import Taro from '@tarojs/taro'
import { commonParame } from '../config/requestConfig'
import Tips from './tips'

// import { createLogger } from './logger'

declare type Methods = "GET" | "OPTIONS" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | "POST-FORM";
declare type Headers = { [key: string]: string };
// declare type Datas = { method: Methods;[key: string]: any; };
interface Options {
	url: string;
	host?: string;
	method?: Methods;
	data?: any;
	header?: Headers;
}

interface IoptsUpLoad {
	host?: string;
	header?: any
	url: string	// 开发者服务器地址
	filePath: string // 要上传文件资源的路径
	name?: string	// 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
	formData?: any // HTTP 请求中其他额外的 form data
	success?: any
	fail?: any
	complete?: any
	fileType?: string
}

interface ILogin {
	authCode: string;
	nickName?: string;
	avatarUrl?: string;
}


export class Request {
	/** 登陆的promise */
	static loginReadyPromise: Promise<any> = Promise.resolve()
	/** 正在登陆 */
	static isLogining: boolean = false
	/** 导出的api对象 */
	static apiLists: { [key: string]: () => any; } = {}
	/** token */
	static token: string = ''
	/** 用户信息包含token */
	static userInfo: any = null

	/**
	 * @static 处理options
	 * @param {Options | string} opts
	 * @param {Datas} data
	 * @returns {Options}
	 * @memberof Request
	 */
	static conbineOptions(opts, data, method: Methods): Options {
		typeof opts === 'string' && (opts = { url: opts })
		let returnOpt = {
			data: typeof data === 'string' ? data : { ...commonParame, ...opts.data, ...data },
			method: opts.method === 'POST-FORM' ? 'POST' : opts.method || data.method || method || 'GET',
			url: `${opts.host || process.env.apiHost}${opts.url}`,
			header: {
				'token': this.getToken(),
				'content-type': opts.method === 'POST-FORM' ? 'application/x-www-form-urlencoded' : 'application/json'
			}
		}
		return returnOpt;
	}

	/** 获取登录的token */
	static getToken() {
		this.token = Taro.getStorageSync(process.env.tokenKey)
		return this.token
	}

	/** 获取登录的用户信息，含token */
	static getUserInfo() {
		this.userInfo = Taro.getStorageSync(`${process.env.tokenKey}_userInfo`)
		return this.userInfo
	}

	/**
	 * 
	 * @static request请求 基于 Taro.request
	 * @param {Options} opts 
	 */
	static async request(opts: Options) {
		const res = await Taro.request(opts)

		// 登陆失效 
		if (res.statusCode === 401) {
			return this.getCodeToLogin(this.request(opts))
		} else if (res.statusCode === 403) {
			let errorMsg = '没有权限'
			const d = {
				...res.data,
				err: errorMsg
			}
			Tips.toast(d.err);
		}

		if (res.data.code === 1) {
			return res.data
		} else {
			let errorMsg = (res.data && res.data.msg) || `网络错误～`
			const d = {
				...res.data,
				err: errorMsg
			}
			Tips.toast(d.err);
			throw new Error(d.err)
		}
	}

	/**
	 * 获取小程序授权,重新登录后再访问接口
	 */
	static getCodeToLogin(func) {
		switch (Taro.getEnv()) {
			case 'WEAPP':
				Taro.login({
					success: (res) => {
						this.login({authCode: res.code}, func)
					}
				})
				break;
			case 'ALIPAY':
				my.getAuthCode({
					scopes: 'auth_user',
					success: (res) => {
						this.login({authCode: res.authCode}, func)
					}
				})
				break;
			default:
				return ''
		}
	}
	// static getCode() {
	// 	switch (Taro.getEnv()) {
	// 		case 'WEAPP':
	// 			Taro.login({
	// 				success: (res) => {
	// 					return res.code || ''
	// 				}
	// 			})
	// 			break;
	// 		case 'ALIPAY':
	// 			my.getAuthCode({
	// 				scopes: 'auth_user',
	// 				success: (res) => {
	// 					return res.authCode || ''
	// 				}
	// 			})
	// 			break;
	// 		default:
	// 			return ''
	// 	}
	// }

	/**
	 * 
	 * @static 登陆
	 * @returns  promise 
	 * @memberof Request
	 */
	static login(param:ILogin, func?:any) {
		if (!this.isLogining) { 
			this.loginReadyPromise = this.onLogining(param, func) 
		}
		return this.loginReadyPromise
	}

	/**
	 *
	 * @static 登陆的具体方法
	 * {authCode, nickName, avatarUrl}
	 * @returns
	 * @memberof Request
	 */
	static onLogining(param:ILogin, func?:any) {
		this.isLogining = true

		let appType: string = Taro.getEnv()
		if (appType === 'ALIPAY') {
			if (!Taro.canIUse('ap.updateAlipayClient')) {
				appType = 'DINGTALK'
			}
		}
		return new Promise(async (resolve, reject) => {
			// 请求登录
			const { code, data } = await this.creatRequests({
				url: '/api/login/noLogin',
				method: 'POST-FORM',
				data: {
					authCode: param.authCode,
					nickName: param.nickName,
					avatarUrl: param.avatarUrl,
					terminal: appType
				}
			})

			if (code === 1 && data && data.token) {
				Taro.setStorageSync(process.env.tokenKey, data.token);
				Taro.setStorageSync(`${process.env.tokenKey}_userInfo`, data);
				this.isLogining = false;

				// 如果因为请求时才失效，那在重登陆后继续请求上一接口
				if(func) {
					func()
				}

				resolve();
			} else {
				reject();
				return;
			}
		})
	}

	/**
	 *
	 * @static  创建请求函数
	 * @param {(Options | string)} opts
	 * @returns
	 * @memberof Request
	 */
	static async creatRequests(opts: Options) {
		const _opts = this.conbineOptions(opts, opts.data, opts.method || 'GET')
		const res = await this.request(_opts)
		return res
	}
	/**
	 * 
	 * @param opts 上传文件
	 */

	static async uploadFile(optsUpLoad: IoptsUpLoad) {
		optsUpLoad.url = `${optsUpLoad.host || process.env.apiHost}${optsUpLoad.url}`;
		optsUpLoad.header = {
			token: this.getToken()
		}
		const res = await Taro.uploadFile(optsUpLoad);
		return res
	}

	// /**
	//  *
	//  * @static 抛出整个项目的api方法
	//  * @returns
	//  * @memberof Request
	//  */
	// // eslint-disable-next-line
	// static getApiList(requestConfig) {
	// 	if (!Object.keys(requestConfig).length) return {}

	// 	Object.keys(requestConfig).forEach((key) => {
	// 		this.apiLists[key] = this.creatRequests(requestConfig[key])
	// 	})

	// 	return this.apiLists
	// }
}

// // 导出
// const Api = Request.getApiList(requestConfig)
// Component.prototype.$api = Api
// export default Api as any
