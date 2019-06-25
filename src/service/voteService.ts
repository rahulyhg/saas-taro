import {Request} from '../utils/request'

// 上传文件 
export const imageUpload = (param) => {
    console.log(param)
    return Request.uploadFile({
        url: '/api/common/imageUpload',
        filePath: param.file, // 要上传文件资源的路径
        name: 'file',	// 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
	    formData: param, // HTTP 请求中其他额外的 form data
    })
}

// 查询 投票详情
export const voteEditDetail = (param) => {
    return Request.creatRequests({
        url: '/api/activityVote/voteEditDetail',
        method: 'POST-FORM',
        data: param
    })
}

// 编辑 投票报名
export const editVote = (param) => {
    return Request.creatRequests({
        url: '/api/activityVote/editVote',
        method: 'POST',
        data: param
    })
}

// 删除 投票报名  
export const deleteVote = (param) => {
    return Request.creatRequests({
        url: '/api/activityVote/deleteVote',
        method: 'POST-FORM',
        data: param
    })
}


// 新增投票 
export const addVote = (param) => {
    return Request.creatRequests({
        url: '/api/activityVote/addVote',
        method: 'POST',
        data: param
    })
}


// 查询 投票详情
export const voteDetail = (param) => {
    return Request.creatRequests({
        url: '/api/activityVote/voteDetail',
        method: 'POST-FORM',
        data: param
    })
}

// 投票 接口  
export const goVote = (param) => {
    return Request.creatRequests({
        url: '/api/activityVote/goVote',
        method: 'POST-FORM',
        data: param
    })
}

// 获取 投票项 详情 接口  
export const voteMoreDetail = (param) => {
    return Request.creatRequests({
        url: '/api/activityVote/voteMoreDetail',
        method: 'POST-FORM',
        data: param
    })
}
