/**
 * description: 公共相关服务
 * author: Marshall
 * date: 20190523
 */
import { Request } from '../utils/request'

interface IOptsUpLoad {
	host?: string;
	url?: string	// 开发者服务器地址
	filePath: string // 要上传文件资源的路径
	name?: string	// 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
	formData?: any // HTTP 请求中其他额外的 form data
	success?: any
	fail?: any
    complete?: any;
    fileType?: string
}

// 上传多图片
export const uploadFile = ( param: IOptsUpLoad ) => {
    console.log(param);
    return Request.uploadFile({
        url: '/api/common/imageUpload',
        fileType: param.fileType,
        filePath: param.filePath,           // 要上传文件资源的路径
        fileType: param.fileType,
        name: 'file',	    // 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
        formData: param,    // HTTP 请求中其他额外的 form data
    });
}

// 获取工作岗位数据
export const getOccupationList = ( param ) => {
    return Request.creatRequests({
        url: '/api/common/select/getOccupationList',
        method: 'GET',
        data: param
    });
}

// 获取民族数据
export const getNationList = ( param ) => {
    return Request.creatRequests({
        url: '/api/common/select/getNationList',
        method: 'GET',
        data: param
    });
}

// 获取学历数据
export const getEducationList = ( param ) => {
    return Request.creatRequests({
        url: '/api/common/select/getEducationList',
        method: 'GET',
        data: param
    });
}

// 根据pid获取地区列表
export const getAreaListByPid = ( param ) => {
    return Request.creatRequests({
        url: '/api/common/select/getAreaListByPid',
        method: 'GET',
        data: param
    });
}