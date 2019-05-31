import { Request } from '../utils/request'
export default {
    addActivity(params) {
        return Request.creatRequests({
            url: '/api/activityEntry/add',
            method: 'POST',
            data: params
        })
    },
    getActivityById(params) {
        return Request.creatRequests({
            url: '/api/activityEntry/activityDetail',
            method: 'POST-FORM',
            data: params
        })
    },

    // 报名人员
    morePeopleById(params) {
        return Request.creatRequests({
            url: '/api/activityEntry/morePeopleById',
            method: 'POST-FORM',
            data: params
        })
    },

    // 报名表单详情
    goActivityEnter(params) {
        return Request.creatRequests({
            url: '/api/activityEntry/goActivityEnter',
            method: 'POST-FORM',
            data: params
        })
    },

    // 报名表单详情

    getActivityResultDetail(params) {
        return Request.creatRequests({
            url: '/api/activityEntry/activityResultDetail',
            method: 'POST-FORM',
            data: params
        })
    },
    deleteActivityById(params) {
        return Request.creatRequests({
            url: '/api/activityEntry/delete',
            method: 'POST-FORM',
            data: params
        })
    },

}