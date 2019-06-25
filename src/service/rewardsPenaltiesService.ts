/** 奖惩接口 */

import { Request } from '../utils/request'
import { IResponse } from 'types/IResponse';

export default {
    /** 新增奖惩 */
    add(params:IAdd):Promise<IResponse<any>> {
        return Request.creatRequests({
            url: '/api/rewardsPenalties/add',
            method: 'POST',
            data: params
        })
    },
    /** 根据id查询奖惩详情 */
    getDetail(params:{id:string}):Promise<IResponse<IRewardsList>> {
        return Request.creatRequests({
            url: '/api/rewardsPenalties/getDetail',
            method: 'GET',
            data: params
        })
    },
    /** 查询登录人权限下组织列表 */
    getOrgList(params):Promise<IResponse<IGetOrgList_Res>> {
        return Request.creatRequests({
            url: '/api/rewardsPenalties/getOrgList',
            method: 'GET',
            data: params
        })
    },
    /** 查询奖惩列表 */
    getRewardsList(params:IRewardsList):Promise<IResponse<Array<IRewardsList>>> {
        return Request.creatRequests({
            url: '/api/rewardsPenalties/getRewardsList',
            method: 'GET',
            data: params
        })
    },
    /** 查询数据字典 */
    getSysDictListByTypeCode(params:{typeCode:string}):Promise<IResponse<any>> {
        return Request.creatRequests({
            url: '/api/rewardsPenalties/getSysDictListByTypeCode',
            method: 'GET',
            data: params
        })
    },
}

export interface IAdd {
    /** 字典表 */
    category:string;
    /** 字典表 */
    categoryName:string;
    /** 附件列表 */
    fileList:Array<any>;
    /** 奖惩类型：0组织荣誉 1组织惩处 2 个人荣誉 3 个人惩处 */
    genre:string;
    /** 获取时间 */
    getDay:string;
    id:string;
    /** 上传的图片列表列表 */
    imgFileList:Array<any>;
    /** 名称 */
    name:string;
    /** 组织code */
    orgCode:string;
    /** 组织id */
    orgId:string;
    /** 组织名称 */
    orgName:string;
    /** 奖惩说明 */
    remark:string;
    /** 为个人奖惩时，用户id当是个人时此字段有值 */
    sysUserId:string;
    /** 用户名称,当是个人时此字段有值 */
    sysUserName:string;
    /** 类别：0 组织 1 个人 */
    type:string;
    /** 添加的人员id集合 */
    userIdList:Array<string>; 
}

export interface IGetOrgList_Res {
    /** 党组织code */
    code:string;
    /** 党组织id */
    id:string;
    /** 党组织名称 */
    name:string;
    /** 组织类型 */
    typeId:string;
}

export interface IRewardsList {
    /** 字典表 */
    category:string;
    /** 字典表 */
    categoryName:string;
    /** 跳转到的页数 */
    current:number;
    /** 附件列表 */
    fileList:Array<any>;
    /** 奖惩类型：0组织荣誉 1组织惩处 2 个人荣誉 3 个人惩处 */
    genre:string;
    /** 缴纳日期 */
    getDay:string;
    /** id */
    id:string;
    /** 上传的图片列表列表 */
    imgFileList:Array<any>;
    /** 图片地址 */
    imgUrl:string;
    /** 名称 */
    name:string;
    /** 组织code */
    orgCode:string;
    /** 组织id */
    orgId:string;
    /** 选中的党组织 */
    orgList:Array<string>;
    /** 组织名称 */
    orgName:string;
    /** 每页展示的记录数 */
    pageSize:number;
    /** 奖惩说明 */
    remark:string;
    /** 为个人奖惩时，用户id当是个人时此字段有值 */
    sysUserId:string;
    /** 用户名称,当是个人时此字段有值 */
    sysUserName:string;
    /** 类别：0 组织 1 个人 */
    type:string;
    /** 查询年份 */
    year:string;
}
