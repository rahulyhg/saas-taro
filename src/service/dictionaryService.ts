import { Request } from '../utils/request'

// 获取学历数据
export const getEducationList = ( param ) => {
    return Request.creatRequests({
        url: '/api/common/select/getEducationList',
        method: 'GET'
    })
}

// 获取民族数据
export const getNationList = ( param ) => {
    return Request.creatRequests({
        url: '/api/common/select/getNationList',
        method: 'GET'
    })
}

// 获取岗位数据
export const getPostList = ( param ) => {
    return Request.creatRequests({
        url: '/api/common/select/getOccupationList',
        method: 'GET'
    })
}

// 获取籍贯数据
export const getAreaListByPid = ( param ) => {
    return Request.creatRequests({
        url: '/api/common/select/getAreaListByPid',
        method: 'GET',
        data: param
    })
}

// 获取字典数据 人员列表 调动类型
export const getSysDictListByTypeCode = ( param ) => {
    return Request.creatRequests({
        url: '/api/common/select/getSysDictListByTypeCode',
        method: 'GET',
        data: param
    })
}