/**
 * description: 公共相关服务
 * author: Marshall
 * date: 20190523
 */
import { Request } from '../utils/request'

interface IAnswer {
	id: string		//主键
}

// 参与详细-趣味答题
export const getPartakeDetail = ( param: IAnswer ) => {
    return Request.creatRequests({
        url: '/api/activitySubject/getPartakeDetail',
        method: 'GET',
        data: param
    });
}

// 参与详细-趣味答题
export const addAnswer = ( param: IAnswer ) => {
    return Request.creatRequests({
        url: '/api/activitySubject/add',
        method: 'POST',
        data: param
    });
}

// 查询趣味答题结果
export const answerResult = ( param: IAnswer ) => {
    return Request.creatRequests({
        url: '/api/activitySubject/getPartakeResult',
        method: 'GET',
        data: param
    });
}

// 编辑-趣味答题详细
export const answerDetail = ( param: IAnswer ) => {
    return Request.creatRequests({
        url: '/api/activitySubject/getDetail',
        method: 'GET',
        data: param
    });
}

// 编辑-趣味答题详细
export const editAnswer = ( param: IAnswer ) => {
    return Request.creatRequests({
        url: '/api/activitySubject/update',
        method: 'POST',
        data: param
    });
}
 
// 提交趣味答题
export const saveAnswer = ( param: IAnswer ) => {
    return Request.creatRequests({
        url: '/api/activitySubject/saveAnswer',
        method: 'POST',
        data: param
    });
}

// 删除趣味答题
export const deleteAnswer = ( param: IAnswer ) => {
    return Request.creatRequests({
        url: '/api/activitySubject/delete',
        method: 'POST',
        data: param
    });
}

// 是否参与过趣味答题
export const isPartake = ( param: IAnswer ) => {
    return Request.creatRequests({
        url: '/api/activitySubject/isPartake',
        method: 'GET',
        data: param
    });
}

