import orgPopViewApi from '../../../service/userAndOrgUtilService';

export default {
  namespace: 'orgPopView',
  state: {
    maxOrg: {},
    list: [],
    checkedList: [],
    checkedOrgList: [],
    searchOrgList: []
  },

  effects: {

    // 获取用户管理最大权限组织&下级组织
    * getMaxOrgByUserId({ payload }, { call, put }) {
      const { code: success, data: result } = yield call(orgPopViewApi.getMaxOrgByUserId, { ...payload });
      console.error(success, result)
      if (success) {
        const maxOrg = { name: result.name, id: result.orgId };
        const { code, data: res } = yield call(orgPopViewApi.getOrgAndUserByorgId, { orgId: maxOrg.id });
        if (code) {
          yield put({
            type: 'updateState',
            payload: {
              list: res.orgDtos,
              maxOrg: maxOrg
            }
          })
        }
      }
    },

    // 根据orgId获取最大组织

    // 获取用户管理最大权限组织&下级组织
    * getMaxOrgByOrgId({ payload }, { call, put }) {
      const { code: success, data: result } = yield call(orgPopViewApi.getMaxOrgByOrgId, { ...payload });
      console.error(success, result)
      if (success) {
        const maxOrg = { name: result.name, id: result.orgId };
        const { code, data: res } = yield call(orgPopViewApi.getOrgAndUserByorgId, { orgId: maxOrg.id });
        if (code) {
          yield put({
            type: 'updateState',
            payload: {
              list: res.orgDtos,
              maxOrg: maxOrg
            }
          })
        }
      }
    },

    // 根据orgId获取下级组织
    * getOrgAndUserByorgId({ payload }, { call, put }) {
      const { code, data: res } = yield call(orgPopViewApi.getOrgAndUserByorgId, { ...payload });
      if (code) {
        yield put({
          type: 'updateState',
          payload: {
            list: res.orgDtos
          }
        })
      }
    },

    // 根据组织名称模糊搜索
    * getOrgByOrgName({ payload }, { call, put }) {
      const { code, data: res } = yield call(orgPopViewApi.getOrgByOrgName, { ...payload });
      if (code) {
        yield put({
          type: 'updateState',
          payload: {
            searchOrgList: res
          }
        })
      }
    }


  },

  reducers: {
    updateState(state, { payload }) {
      return ({ ...state, ...payload })
    },

    clearOrgs() {
      return ({
        maxOrg: {},
        list: [],
        checkedList: [],
        checkedOrgList: [],
        searchOrgList: []
      })
    }

  }

}
