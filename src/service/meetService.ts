import {Request} from '../utils/request'

// 普通用户的会议列表
export const getListForPerson = (param) => {
    return Request.creatRequests({
        url: '/api/meet/listForPerson',
        method: 'POST',
        data: param
    })
}

// 查询 会议类型 列表
export const getListMeetType = (param) => {
    return Request.creatRequests({
        url: '/api/meet/listMeetType',
        method: 'POST',
        data: param
    })
}

// 新增 会议
export const addMeet = (param) => {
    return Request.creatRequests({
        url: '/api/meet/addMeet',
        method: 'POST',
        data: param
    })
}

// 根据选择的组织和人员查询真实的人员列表
export const findRelUserList = (param) => {
    return Request.creatRequests({
        url: '/api/meet/findRelUserList',
        method: 'POST',
        data: param
    })
}

// 普通用户的会议列表POST /api/meet/listForMgr
export const getListForMgr = (param) => {
    return Request.creatRequests({
        url: '/api/meet/listForMgr',
        method: 'POST',
        data: param
    })
}

// 上传图片 
export const imageUpload = (param) => {
    return Request.uploadFile({
        url: '/api/common/imageUpload',
        filePath: param.file, // 要上传文件资源的路径
        name: 'file',	// 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
	    formData: param, // HTTP 请求中其他额外的 form data
    })
}

// 查询会议详情
export const findMeetDetailById = (param) => {
    return Request.creatRequests({
        url: '/api/meet/findMeetById',
        method: 'POST-FORM',
        data: param
    })
}

// 返回回放地址
export const getRecordUrl = (param) => {
    return Request.creatRequests({
        url: '/api/meetVideo/recordUrl',
        method: 'POST',
        data: param
    })
}

// 签到接口POST  用户点击签到按钮时的接口
export const doSign = (param) => {
    return Request.creatRequests({
        url: '/api/meet/doSign',
        method: 'POST',
        data: param
    })
}

// 个人访问返回直播状态和播流地址
export const getPullUrlByMeetId = (param) => {
    return Request.creatRequests({
        url: '/api/meetVideo/getPullUrlByMeetId',
        method: 'POST-FORM',
        data: param
    })
}