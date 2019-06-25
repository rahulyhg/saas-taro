/**
 * 党费相关
 */
import Taro from '@tarojs/taro';
import transferService from '../../../service/transferService';

export default {
    namespace: 'partyTransfer',
    state: {
        postList: [],
        educationList: [],
        nationList: [],
        transferList:[],
        detail:{}

    },
    effects: {

        * getPageList({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(transferService.getPageList, payload);
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: { transferList: data }
                })
            }
        },

        * getUserMoveById({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(transferService.getUserMoveById, payload);
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: { detail: data }
                })
            }
        },


        * addUserMove({ payload }, { call, put }) {
            Taro.showLoading({
                title:'提交中',
                mask:true
            })
            // response为接口返回值
            const { code, data } = yield call(transferService.addUserMove, payload);
            Taro.hideLoading();
            if (code === 1) {
                Taro.redirectTo({
                    url:'/subPackageWork/pages/transfer/index/index?tabId=1'
                }).then(()=>{
                    Taro.showToast({
                        title:'发起成功',
                        icon:'none'
                    })
                })
            }
        },

        * getEducationList({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(transferService.getEducationList, payload);
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: { educationList: data }
                })
            }
        },

        * getPostList({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(transferService.getPostList, payload);
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: { postList: data }
                })
            }
        },

        * getNationList({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(transferService.getNationList, payload);
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: { nationList: data } 
                })
            }
        },

        * getAreaListByPid({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(transferService.getAreaListByPid, payload);
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: { areaList: data }
                })
            }
        },

        * getSysDictListByTypeCode({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(transferService.getSysDictListByTypeCode, payload);
            if (code === 1) {
                if(payload.typeCode=='party_user_type'){
                    yield put({
                        type: 'updateState',
                        payload: { typeList: data }
                    })
                }else{
                    yield put({
                        type: 'updateState',
                        payload: { moveTypeList: data }
                    })
                }
                
            }
        },


        * updateForApprove({ payload }, { call, put }) {
            Taro.showLoading({
                title:'提交中',
                mask:true
            })
            // response为接口返回值
            const { code, data } = yield call(transferService.updateForApprove, payload);
            Taro.hideLoading();
            if (code === 1) {
                Taro.navigateTo({
                    url:'/subPackageWork/pages/transfer/index/index'
                }).then(()=>{
                    Taro.showToast({
                        title:'审核成功',
                        icon:'none'
                    })
                })
            }
        },

        * updateForCancel({ payload }, { call, put }) {
            Taro.showLoading({
                title:'提交中',
                mask:true
            })
            // response为接口返回值
            const { code, data } = yield call(transferService.updateForCancel, payload);
            Taro.hideLoading();
            if (code === 1) {
                Taro.navigateTo({
                    url:'/subPackageWork/pages/transfer/index/index?tabId=1'
                }).then(()=>{
                    Taro.showToast({
                        title:'撤销成功',
                        icon:'none'
                    })
                })
            }
        },

        * updateMove({ payload }, { call, put }) {
            Taro.showLoading({
                title:'提交中',
                mask:true
            })
            // response为接口返回值
            const { code, data } = yield call(transferService.updateMove, payload);
            Taro.hideLoading();
            if (code === 1) {
                Taro.navigateTo({
                    url:'/subPackageWork/pages/transfer/index/index?tabId=1'
                }).then(()=>{
                    Taro.showToast({
                        title:'重新发起成功',
                        icon:'none'
                    })
                })
            }
        },

        * getLetterInfoById({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(transferService.getLetterInfoById, payload);
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: { letterInfo: data }
                })
            }
        }


    },

    reducers: {
        updateState(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    }

}
