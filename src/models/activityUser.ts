export default {
    namespace: 'activityUser',
    state: {
        // 编辑中已选组织
        oldCheckedUserList: [],
        checkedUserList: []
    },

    effects: {

    },
    reducers: {
        updateState(state, { payload }) {
            return ({ ...state, ...payload })
        },
        clearUsers(state) {
            return ({
                ...state,
                oldCheckedUserList: [],
                checkedUserList: []
            })
        }
    }
}