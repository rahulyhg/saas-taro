import surveyApi from '../service/surveyService';
export default {
    namespace: 'preOption',
    state: {
        preOptions: []
    },

    effects: {
        * getPreOptions({ payload }, { call, put }) {
            const { code, data } = yield call(surveyApi.getPreOptions);
            if (code == 1) {
                yield put({
                    type: 'updateState',
                    payload: {
                        preOptions: data
                    }
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