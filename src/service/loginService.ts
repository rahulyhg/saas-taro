import {Request} from '../utils/request'
import { IResponse } from 'types/IResponse';


export const login = (param) => {
    return Request.login(param);
}

/** 发送验证码 */
export const sendMsg = (param:ISendMsg):Promise<IResponse<any>> => {
    return Request.creatRequests({
        url: '/api/login/sendMsg',
        method: 'POST',
        data: param
    })
}

/** 绑定账号 */
export const bindPhone = (param:IBindPhone):Promise<IResponse<INoLoginRes>> => {
    return Request.creatRequests({
        url: '/api/login/bindPhone',
        method: 'POST',
        data: param
    })
}

/** 免登录 */
export const noLogin = (param:INoLogin):Promise<IResponse<INoLoginRes>> => {
    return Request.creatRequests({
        url: '/api/login/noLogin',
        method: 'POST',
        data: param
    })
}

export interface ISendMsg {
    phone: string;
}

export interface IBindPhone {
    /** 验证码 */
    activeCode: string;
    /** 小程序openId */
    miniOpenid: string;
    /** 手机号 */
    phone: string;
    /** 密码 */
    pwd: string;
    /** 终端类型 */
    terminal: 'WEAPP' | 'ALIPAY' | 'DINGTALK';
}

export interface INoLogin {
    /** 当前小程序入口 */
    terminal: 'WEAPP' | 'ALIPAY' | 'DINGTALK',
    /** 小程序授权code */
    authCode: string;
    version?: string;
    nickName?: string;
    avatarUrl?: string;
    gender?: string;
    country?: string;
    province?: string;
    city?: string;
}
export interface INoLoginRes {
    /** openid */
    miniOpenid: string;
    /** 用户头像图片的 URL , */
    avatarUrl: string;
    /** 用户所在城市 */
    city: string;
    /** 用户所在国家  */
    country: string;
    /** 用户性别 0未知 1 男性 2 女性 , */
    gender: 0 | 1 | 2;
    /** 是否管理员 , */
    isAdmin: string;
    /** 是否跳转到绑定页 */
    isRedirect: 0 | 1;
    /** 用户最大权限组织id , */
    maxOrgId: string;
    /** 用户最大权限组织名称 , */
    maxOrgName: string;
    /** 用户昵称 , */
    nickName: string;
    /** 用户所在组织id , */
    orgId: string;
    /** 用户所在组织名称 , */
    orgName: string;
    /** 姓名 , */
    person_name: string;
    /** 手机号 , */
    phone: string;
    /** 用户所在省份 , */
    province : string;
    /** 系统用户id , */
    sysUserId: string;
    token: string;
    /** 用户类型：0 系统用户 1 非系统用户 */
    type: 0 | 1;
}
