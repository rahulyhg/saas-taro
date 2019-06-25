/**
 * 党费相关
 */
import Taro from '@tarojs/taro';
import partyFeeApi from '../../../service/partyFeeService';
import orgPopViewApi from '../../../service/userAndOrgUtilService';

export default {
    namespace: 'partyFee',
    state: {
        // 待缴纳详情
        willPayDetail: {},
        personRecordList: [],
        recordList: [],
        orgList:[],
        personBase:{}
    },
    effects: {

        // 获取用户管理最大权限组织&下级组织
        * getMaxOrgByUserId({ payload }, { call, put }) {
            const { code: success, data: result } = yield call(orgPopViewApi.getMaxOrgByUserId, { ...payload });
            if (success === 1) {
                const temp = {
                    orgId: result.orgId,
                    orgName: result.name,
                    orgCode: result.orgCode,
                }
                let orgList: any = [];
                orgList.push(temp);
                yield put({
                    type: 'updateState',
                    payload: {
                        orgList: orgList
                    }
                })
            }
        },

        * getPartyFeeByUserId({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(partyFeeApi.getPartyFeeByUserId, payload);
            console.log(data)
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: {
                        willPayDetail: data
                    }
                })
            }

        },
        * getPartyFeeRecordList({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(partyFeeApi.getPartyFeeRecordList, payload);
            console.log(data)
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: {
                        personRecordList: data
                    }
                })
            }

        },

        * getPartyUserByOrgId({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(partyFeeApi.getPartyUserByOrgId, payload);
            console.log(data)
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: {
                        record: data
                    }
                })
            }

        },

        * getPartyFeeBase({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(partyFeeApi.getPartyFeeBase, payload);
            console.log(data)
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: {
                        personBase: data
                    }
                })
            }

        },

        * pay({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(partyFeeApi.pay, payload);
            if (code === 1) {
               
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
