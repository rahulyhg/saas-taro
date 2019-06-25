export default {
    namespace: 'activityOrg',
    state: {
        checkboxOrgList: [],
        // 编辑中已选组织
        oldCheckedOrgList: [],
        checkedOrgList: []
    },

    effects: {

    },
    reducers: {
        updateState(state, { payload }) {
            return ({ ...state, ...payload })
        },

        clearOrgs(state) {
            return ({
                ...state,
                checkboxOrgList: [],
                oldCheckedOrgList: [],
                checkedOrgList: []
            })
        }
    }
}