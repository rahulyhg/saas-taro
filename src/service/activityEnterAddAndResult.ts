import {Request} from '../utils/request'

// 查看报名结果 
interface IactivityResult {
    activityId: string//  活动id string
    current: number//  跳转到的页数 integer 
    pageSize: number// 每页展示的记录数 integer
}
export const activityResult = (param: IactivityResult) => {
    return Request.creatRequests({
        url: '/api/activityEntry/activityResult',
        method: 'POST-FORM',
        data: param
    })
}

export const activityDetail = (param) => {
    return Request.creatRequests({
        url: '/api/activityEntry/searchById',
        method: 'POST-FORM',
        data: param
    })
}

export const activityEdit = (param) => {
    return Request.creatRequests({
        url: '/api/activityEntry/edit',
        method: 'POST',
        data: param
    })
}
export const sumbitActivityEnter = (param) => {
    return Request.creatRequests({
        url: '/api/activityEntry/sumbitActivityEnter',
        method: 'POST',
        data: param
    })
}

