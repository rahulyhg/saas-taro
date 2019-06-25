/**
 * 党费相关
 */
import Taro from '@tarojs/taro';
import Api from '../../../service/integralService';


export default {
    namespace: 'integral',
    state: {
        rankDetail: {},
        personRank:{},
        orgRank:{},
        detailList:[]
    },
    effects: {

        // 个人积分 & 组织积分排名
        * queryByUserIdForScore({ payload }, { call, put }) {
            const { code: success, data: result } = yield call(Api.queryByUserIdForScore, { ...payload });
            if (success === 1) {
                yield put({
                    type: 'updateState',
                    payload: { rankDetail: result }
                })
            }
        },

        // 个人排名
        * queryAllPageListForPerson({ payload }, { call, put }) {
            const { code: success, data: result } = yield call(Api.queryAllPageListForPerson, { ...payload });
            if (success === 1) {
                yield put({
                    type: 'updateState',
                    payload: { personRank: result }
                })
            }
        },

        // 组织排名
        * queryAllPageListForOrg({ payload }, { call, put }) {
            const { code: success, data: result } = yield call(Api.queryAllPageListForOrg, { ...payload });
            if (success === 1) {
                yield put({
                    type: 'updateState',
                    payload: { orgRank: result }
                })
            }
        },

        // 积分明细

        * queryIntegralDetailList({ payload }, { call, put }) {
            const { code: success, data: result } = yield call(Api.queryIntegralDetailList, { ...payload });
            if (success === 1) {
                yield put({
                    type: 'updateState',
                    payload: { detailList: result }
                })
            }
        },



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
