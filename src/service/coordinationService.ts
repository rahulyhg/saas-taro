//工作协调接口

import { Request } from '../utils/request'

interface IComment {
    businessId: string,  // 业务id (生态圈或者文章id)
    replyMsg: string    // 回复内容
}


// 获取工作协同列表
export const getPageList = ( param : any ) => {
    return Request.creatRequests({
        url: '/api/work/getPageList',
        method: 'GET',
        data: param
    });
}



// 工作协同-->动态列表
export const listDynamic = (param: any) => {
    return Request.creatRequests({
        url: '/api/work/getActionPageList',
        method: 'GET',
        data: param
    });
}

// 工作协同-->评论列表
export const listComment = (param: any) => {
    return Request.creatRequests({
        url: '/api/work/getCommonCommentList',
        method: 'GET',
        data: param
    });
}


// 工作协同-->发布
export const saveWorkCoordination = (param: any) => {
    return Request.creatRequests({
        url: '/api/work/saveWorkCoordination',
        method: 'POST',
        data: param
    });
}

// 新增工作协同评论
export const addComment = (param: IComment) => {
    return Request.creatRequests({
        url: '/api/work/moments',
        method: 'POST-FORM',
        data: param
    });
}

// 新增工作协同回复评论
export const replayComment = (param: IComment) => {
    return Request.creatRequests({
        url: '/api/work/momentsReply',
        method: 'POST-FORM',
        data: param
    });
}

//工作协同评论中回复子回复
export const replayReplay = (param: IComment) => {
    return Request.creatRequests({
        url: '/api/work/momentsReplyComment',
        method: 'POST-FORM',
        data: param
    });
}


//删除工作协同
export const  deleteWorkCoordination = (param) =>{
    return Request.creatRequests({
        url: '/api/work/deleteWorkCoordination',
        method: 'POST-FORM',
        data: param
    });
}

//更新工作编辑
export const updateWorkCoordination = (param) =>{
    return Request.creatRequests({
        url: '/api/work/updateWorkCoordination',
        method: 'POST',
        data: param
    });
}

// 工作协同-->附件列表
export const listFile = (param: any) => {
    return Request.creatRequests({
        url: '/api/work/getWorkCoordinationFileList',
        method: 'GET',
        data: param
    });
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

//上传工作协同附件（目前仅仅上传图片）
export const uploadFile = (param: any) => {
    return Request.creatRequests({
        url: '/api/work/saveWorkCoordinationFile',
        method: 'POST-FORM',
        data: param
    });
}

//删除附件
export const deleteFile = (param: any) => {
    return Request.creatRequests({
        url: '/api/work/deleteWorkCoordinationFile',
        method: 'POST-FORM',
        data: param
    });
}


//删除回复
export const deleteReply = (param: any) => {
    return Request.creatRequests({
        url: '/api/work/delete',
        method: 'POST-FORM',
        data: param
    });
}

export const getWorkCoordinationDetail = (param : any ) => {
    return Request.creatRequests({
        url: '/api/work/getWorkCoordinationDetail',
        method: 'GET',
        data: param
    });
}
