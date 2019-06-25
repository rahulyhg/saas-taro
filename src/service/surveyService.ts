import { Request } from '../utils/request'
export default {
    addSurvey(params) {
        return Request.creatRequests({
            url: '/api/activitySurvey/add',
            method: 'POST',
            data: params
        })
    },

    surveyDetail(params) {
        return Request.creatRequests({
            url: '/api/activitySurvey/getDetail',
            method: 'GET',
            data: params
        })
    },

    editSurvey(params) {
        return Request.creatRequests({
            url: '/api/activitySurvey/update',
            method: 'POST',
            data: params
        })
    },

    getPartakeDetail(params) {
        return Request.creatRequests({
            url: '/api/activitySurvey/getPartakeDetail',
            method: 'GET',
            data: params
        })
    },
    
    getMyPartakeDetail(params) {
        return Request.creatRequests({
            url: '/api/activitySurvey/getMyPartakeDetail',
            method: 'GET',
            data: params
        })
    },

    saveAnswer(params) {
        return Request.creatRequests({
            url: '/api/activitySurvey/saveAnswer',
            method: 'POST',
            data: params
        })
    },

    surveyResult(params) {
        return Request.creatRequests({
            url: '/api/activitySurvey/getPartakeResult',
            method: 'GET',
            data: params
        })
    },

    getAnswerValueList(params) {
        return Request.creatRequests({
            url: '/api/activitySurvey/getAnswerValueList',
            method: 'GET',
            data: params
        })
    },

    getPreOptions(params) {
        return Request.creatRequests({
            url: '/api/activityEntry/preSetOption',
            method: 'POST'
        })
    },

    isPartake(params) {
        return Request.creatRequests({
            url: '/api/activitySurvey/isPartake',
            method: 'GET',
            data: params
        })
    },

}