import { Request } from '../utils/request'
export default {
    getMaxOrgByUserId(params) {
        return Request.creatRequests({
            url: '/api/common/select/getSysOrgAdminByUser',
            method: 'POST',
            data: params
        })
    },

    getMaxOrgByOrgId(params) {
        return Request.creatRequests({
            url: '/api/common/select/getCurrentOrgByOrgId',
            method: 'POST-FORM',
            data: params
        })
    },

    // 获取账套内最大组织
    getTantentOrg(params) {
        return Request.creatRequests({
            url: '/api/common/select/getTantentOrg',
            method: 'POST',
            data: params
        })
    },


    getOrgAndUserByorgId(params) {
        return Request.creatRequests({
            url: '/api/common/select/getOrgAndUserByorgId',
            method: 'POST-FORM',
            data: params
        })
    },
    getOrgByOrgName(params){
        return Request.creatRequests({
            url: '/api/common/select/getOrgByOrgName',
            method: 'POST-FORM',
            data: params
        })
    },
    getUserByUserName(params){
        return Request.creatRequests({
            url: '/api/common/select/getUserByUserName',
            method: 'POST-FORM',
            data: params
        })
    }
  

}