/**
 * description: 党员流动服务
 * author: Marshall
 * date: 20190610
 */
import { Request } from '../utils/request'

interface ITurnover {
    id: string,		    // 主键
    current: number,    // 当前页
    pageSize: number,   // 每页条数
    name: string,       // 党员姓名
}

// 获取党员流动信息列表
export const getPageList = ( param: ITurnover ) => {
    return Request.creatRequests({
        url: '/api/partyUserFlow/getPageList',
        method: 'POST',
        data: param
    });
}

// 新增党员流入
export const addFlowIn = ( param: ITurnover ) => {
    return Request.creatRequests({
        url: '/api/partyUserFlow/addFlowIn',
        method: 'POST',
        data: param
    });
}

// 新增党员流入
export const addFlowOut = ( param: ITurnover ) => {
    return Request.creatRequests({
        url: '/api/partyUserFlow/addFlowOut',
        method: 'POST',
        data: param
    });
}

// 根据id获取党员流动详情
export const getOneById = ( param: ITurnover ) => {
    return Request.creatRequests({
        url: '/api/partyUserFlow/getOneById',
        method: 'GET',
        data: param
    });
}

//  党员流动返回
export const flowback = ( param: ITurnover ) => {
    return Request.creatRequests({
        url: '/api/partyUserFlow/flowback',
        method: 'POST',
        data: param
    });
}
