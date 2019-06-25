import { Request } from '../utils/request'
export default {

    // 获取个人积分 & 组织积分排名
    queryByUserIdForScore(params) {
        return Request.creatRequests({
            url: '/integral/queryByUserIdForScore',
            method: 'POST-FORM',
            data: params
        })
    },
    
    queryIntegralDetailList(params) {
        return Request.creatRequests({
            url: '/integral/queryIntegralDetailList',
            method: 'GET',
            data: params
        })
    },

    queryAllPageListForOrg(params) {
        return Request.creatRequests({
            url: '/integral/queryAllPageListForOrg',
            method: 'GET',
            data: params
        })
    },

    queryAllPageListForPerson(params) {
        return Request.creatRequests({
            url: '/integral/queryAllPageListForPerson',
            method: 'GET',
            data: params
        })
    },
}