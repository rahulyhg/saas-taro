import { Request } from '../utils/request'

export interface IGetDetatil {
    typeCode: string;
}

export interface IGetDetatil_res {

    /** 属性名称 */
    name: string;

    /** 类型编码 */
    typeCode: string;

    /** 类型名称 */
    typeName: string;
}

/** 获取系统配置，数据字典 */
export const getDetail = (params:IGetDetatil) => {
    return Request.creatRequests({
        url: '/api/sysDict/getDetail',
        data: params
    })
},