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
	complete?: any
}

// 上传多图片
export const uploadFile = ( param: IOptsUpLoad ) => {
    return Request.uploadFile({
        url: '/api/common/imageUpload',
        filePath: param.filePath,           // 要上传文件资源的路径
        name: 'file',	    // 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
        formData: param,    // HTTP 请求中其他额外的 form data
    });
}
