/**
 * description: 点赞相关服务
 * author: Marshall
 * date: 20190517
 */

import { Request } from '../utils/request'

interface IComment {
    id: string,             // 评论/回复id
    businessId: string,     // 业务id (生态圈或者文章id),
    replyMsg: string        // 回复内容
    replyId:string          // 评论id
    replyCommentId: string  // 回复id
}

// 删除生态圈评论
export const delComment = ( param: IComment ) => {
    return Request.creatRequests({
        url: '/api/commonComment/delete',
        method: 'POST-FORM',
        data: param
    });
}

// 新增生态圈评论
export const addComment = ( param: IComment ) => {
    return Request.creatRequests({
        url: '/api/commonComment/moments',
        method: 'POST-FORM',
        data: param
    });
}

// 新增生态圈回复评论
export const addReply = ( param: IComment ) => {
    return Request.creatRequests({
        url: '/api/commonComment/momentsReply',
        method: 'POST-FORM',
        data: param
    });
}

// 新增回复评论:回复-回复
export const replyComment = ( param: IComment ) => {
    return Request.creatRequests({
        url: '/api/commonComment/momentsReplyComment',
        method: 'POST-FORM',
        data: param
    });
}

// 获取评论列表
export const getCommonCommentList = ( param: IComment ) => {
    return Request.creatRequests({
        url: '/api/commonComment/getCommonCommentList',
        method: 'GET',
        data: param
    });
}