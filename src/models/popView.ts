export default {
    namespace: 'popView',
    state: {},

    effects: {
        * clear({ payload }, { put }) {
            yield put({
                type: 'orgPopView/clearOrgs'
            })
            yield put({
                type: 'userPopView/clearUsers'
            })
            yield put({
                type: 'activityOrg/clearOrgs'
            })
            yield put({
                type: 'activityUser/clearUsers'
            })

            yield put({
                type: 'userSinglePopView/clear'
            })
            yield put({
                type: 'orgSinglePopView/clear'
            })
        }
    },

    reducers: {
        updateState(state, { payload }) {
            return ({ ...state, ...payload })
        }
    }
}