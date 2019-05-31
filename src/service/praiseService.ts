/**
 * description: 点赞相关服务
 * author: Marshall
 * date: 20190517
 */

import { Request } from '../utils/request'

interface IPraise {
    businessId: string,    // 业务id (生态圈或者文章id或者评论id)
}

// 点赞
export const savePraise = ( param: IPraise ) => {
    return Request.creatRequests({
        url: '/api/commonPraise/moments',
        method: 'POST-FORM',
        data: param
    });
}

// 取消点赞
export const canclePraise = ( param: IPraise ) => {
    return Request.creatRequests({
        url: '/api/commonPraise/delete',
        method: 'POST-FORM',
        data: param
    });
}

// 转发帖子
export const forward = ( param: IPraise ) => {
    return Request.creatRequests({
        url: '/api/momentsMain/forward',
        method: 'POST-FORM',
        data: param
    });
}
