/**
 * 数据字典相关
 */
import { getEducationList, getPostList, getNationList, getAreaListByPid, 
    getSysDictListByTypeCode } from '../service/dictionaryService';

export default {
    namespace: 'dictionary',
    state: {
        postList: [],
        educationList: [],
        nationList: []
    },
    effects: {

        *getEducationList({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(getEducationList, payload);
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: { educationList: data }
                })
            }
        },

        *getPostList({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(getPostList, payload);
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: { postList: data }
                })
            }
        },

        *getNationList({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(getNationList, payload);
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: { nationList: data }
                })
            }
        },

        *getAreaListByPid({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(getAreaListByPid, payload);
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: { areaList: data }
                })
            }
        },

        *getSysDictListByTypeCode({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(getSysDictListByTypeCode, payload);
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: { typeList: data }
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
