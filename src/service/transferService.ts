import { Request } from '../utils/request'
export default {

    // 获取列表数据
    getPageList(params) {
        return Request.creatRequests({
            url: '/api/partyUserMove/getPageList',
            method: 'GET',
            data: params
        })
    },

    // 获取调动详情
    getUserMoveById(params) {
        return Request.creatRequests({
            url: '/api/partyUserMove/getUserMoveById',
            method: 'GET',
            data: params
        })
    },

    // 发起调动
    addUserMove(params) {
        return Request.creatRequests({
            url: '/api/partyUserMove/addUserMove',
            method: 'POST',
            data: params
        })
    },

    // 审批
    updateForApprove(params) {
        return Request.creatRequests({
            url: '/api/partyUserMove/updateForApprove',
            method: 'POST',
            data: params
        })
    },

    // 撤回
    updateForCancel(params) {
        return Request.creatRequests({
            url: '/api/partyUserMove/updateForCancel',
            method: 'POST',
            data: params
        })
    },

    // 重新发起
    updateMove(params) {
        return Request.creatRequests({
            url: '/api/partyUserMove/updateMove',
            method: 'POST',
            data: params
        })
    },


    // 获取学历数据
    getEducationList() {
        return Request.creatRequests({
            url: '/api/common/select/getEducationList',
            method: 'GET'
        })
    },

    // 获取民族数据
    getNationList() {
        return Request.creatRequests({
            url: '/api/common/select/getNationList',
            method: 'GET'
        })
    },

    // 获取岗位数据
    getPostList() {
        return Request.creatRequests({
            url: '/api/common/select/getOccupationList',
            method: 'GET'
        })
    },

    // 获取籍贯数据
    getAreaListByPid(params) {
        return Request.creatRequests({
            url: '/api/common/select/getAreaListByPid',
            method: 'GET',
            data: params
        })
    },

    // 获取字典数据 人员列表 调动类型
    getSysDictListByTypeCode(params) {
        return Request.creatRequests({
            url: '/api/common/select/getSysDictListByTypeCode',
            method: 'GET',
            data: params
        })
    },

    //介绍信
    getLetterInfoById(params) {
        return Request.creatRequests({
            url: '/api/partyUserMove/getLetterInfoById',
            method: 'GET',
            data: params
        })
    }


}