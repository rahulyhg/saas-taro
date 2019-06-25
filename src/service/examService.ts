import {Request} from '../utils/request'

// 开始答题
export const beginExam = (param) => {
    return Request.creatRequests({
        url: '/api/partyExam/beginExam',
        method: 'POST-FORM',
        data: param
    })
}
// 获取考试详细
export const getDetail = (param) => {
    return Request.creatRequests({
        url: '/api/partyExam/getDetail',
        method: 'GET',
        data: param
    })
}

// 根据考试id，获取题目和答案列表
export const getListQuestion = (param) => {
    return Request.creatRequests({
        url: '/api/partyExam/getListQuestion',
        method: 'GET',
        data: param
    })
}

// 根据考试id，获取我的考试结果
export const getMyAnswer = (param) => {
    return Request.creatRequests({
        url: '/api/partyExam/getMyAnswer',
        method: 'GET',
        data: param
    })
}

// 获取考试列表
export const getPageList = (param) => {
    return Request.creatRequests({
        url: '/api/partyExam/getPageList',
        method: 'GET',
        data: param
    })
}

// 根据考试id，题目号获取该题目的正确答案，用户答案。
export const getQuestionData = (param) => {
    return Request.creatRequests({
        url: '/api/partyExam/getQuestionData',
        method: 'GET',
        data: param
    })
}

// 提交答案
export const saveExamSubmit = (param) => {
    return Request.creatRequests({
        url: '/api/partyExam/saveExamSubmit',
        method: 'POST',
        data: param
    })
}