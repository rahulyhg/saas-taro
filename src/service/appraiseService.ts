/**
 * description: 民主评议服务
 * author: Marshall
 * date: 20190601
 */
import { Request } from '../utils/request'

interface IAppraise {
    appraisalId: string;	        // 主键
    ownAppraiseContent: string;     // 自评内容
    ownAppraiseType: string;        // 自评结果
    current: number;                // 跳转到的页数
    pageSize: number;               // 每页展示的记录数,
    userList: Array<any>;           // 互评用户列表信息，
    mark: string;                   // 0是系统用户 1 是群众意见
}

// 获取民主评议信息
export const getAppraiseDetail = ( param: IAppraise ) => {
    return Request.creatRequests({
        url: '/api/partyDemocratic/queryDemocraticInfoById',
        method: 'GET',
        data: param
    });
}

// 获取民主评议信息
export const getPartyResult = ( param: IAppraise ) => {
    return Request.creatRequests({
        url: '/api/partyDemocratic/queryJudgeInfoById',
        method: 'GET',
        data: param
    });
}

// 获取自评信息
export const getSelfAppraise = ( param: IAppraise ) => {
    return Request.creatRequests({
        url: '/api/partyDemocratic/queryOwnInfoById',
        method: 'GET',
        data: param
    });
}

// 获取最新的一条民主评议状态
export const getAppraiseState = ( param: IAppraise ) => {
    return Request.creatRequests({
        url: '/api/partyDemocratic/queryStateBySysUserId',
        method: 'GET',
        data: param
    });
}

// 新增自评
export const saveOwnAppraise = ( param: IAppraise ) => {
    return Request.creatRequests({
        url: '/api/partyDemocratic/saveOwnAppraisal',
        method: 'POST',
        data: param
    });
}

// 获取互评信息
export const getOtherAppraise = ( param: IAppraise ) => {
    return Request.creatRequests({
        url: '/api/partyDemocratic/queryEachInfoById',
        method: 'GET',
        data: param
    });
}

// 获取民主评议列表
export const getPageList = ( param: IAppraise ) => {
    return Request.creatRequests({
        url: '/api/partyDemocratic/getPageList',
        method: 'GET',
        data: param
    });
}

// 新增互评
export const saveEachAppraisal = ( param: IAppraise ) => {
    return Request.creatRequests({
        url: '/api/partyDemocratic/saveEachAppraisal',
        method: 'POST',
        data: param
    });
}