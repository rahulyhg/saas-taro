import { Request } from '../utils/request'
export default {
    
    // 获取个人待缴纳党费
    getPartyFeeByUserId(params) {
        return Request.creatRequests({
            url: '/api/partyMembershipDues/getPartyFee',
            method: 'GET',
            data: params
        })
    },

    // 个人党费记录
    getPartyFeeRecordList(params) {
        return Request.creatRequests({
            url: '/api/partyMembershipDues/getPartyFeeRecordList',
            method: 'GET',
            data: params
        })
    },

    // 获取组织下党员交纳情况
    getPartyUserByOrgId(params) {
        return Request.creatRequests({
            url: '/api/partyMembershipDues/getPartyUserByOrgId',
            method: 'GET',
            data: params
        })
    },

    // 获取个人缴纳标准
    getPartyFeeBase(params){
        return Request.creatRequests({
            url: '/api/partyMembershipDues/getPartyFeeBase',
            method: 'GET',
            data: params
        })
    },

    // 个人党费缴纳
    pay(params){
        return Request.creatRequests({
            url: '/alipay/fee/getMultiMiniPayOrderInfo',
            method: 'POST',
            data: params
        })
    }
    
    
    

   
}