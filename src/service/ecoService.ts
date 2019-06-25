/**
 * description: 生态圈相关服务
 * author: Marshall
 * date: 20190517
 */

import { Request } from '../utils/request'

interface IEco {
    current: number,    // 跳转到的页数
    pageSize: number    // 每页展示的记录数
}

// 获取我的生态圈
export const getPageList = ( param: IEco ) => {
    return Request.creatRequests({
        url: '/api/momentsMain/getPageList',
        method: 'GET',
        data: param
    });
}

// 获取我发布生态圈
export const getMyPageList = ( param: IEco ) => {
    return Request.creatRequests({
        url: '/api/momentsMain/getMyPageList',
        method: 'GET',
        data: param
    });
}

// 获取我发布生态圈
export const getActionPageList = ( param: IEco ) => {
    return Request.creatRequests({
        url: '/api/momentsMain/getActionPageList',
        method: 'GET',
        data: param
    });
}

// 获取生态圈详情
export const getDetail = ( param: IEco ) => {
    return Request.creatRequests({
        url: '/api/momentsMain/getDetail',
        method: 'GET',
        data: param
    });
}

// 新增生态圈
export const addEco = ( param: IEco ) => {
    return Request.creatRequests({
        url: '/api/momentsMain/add',
        method: 'POST',
        data: param
    });
}
