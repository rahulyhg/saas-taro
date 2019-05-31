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
            url: '/api/common/select/getOrgByOrgName',
            method: 'POST-FORM',
            data: params
        })
    }
  

}