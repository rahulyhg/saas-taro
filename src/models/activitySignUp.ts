import activityApi from '../service/activityService';
export default {
    namespace: 'activitySignUp',
    state: {
        activityFormData: {},
        activitySignUpDetail:{}
    },

    effects: {
        * activityFormDetail({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(activityApi.goActivityEnter, payload);
            console.log(code,data)
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: { activityFormData: data }
                })
            }

        },

        * activitySignUpDetail({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(activityApi.getActivityResultDetail, payload);
            console.log(code,data)
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: { activitySignUpDetail: data }
                })
            }

        }
    },

    reducers: {
        updateState(state, { payload }) {
            return ({ ...state, ...payload })
        }
    }
}