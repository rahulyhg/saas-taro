import orgPopViewApi from '../../../service/userAndOrgUtilService';

export default {
  namespace: 'orgSinglePopView',
  state: {
    searchList: [],
    maxOrg: {},
    list: [],
    checkedOrg: {}
  },

  effects: {

    // 获取用户管理最大权限组织&下级组织
    * getMaxOrgByUserId({ payload }, { call, put }) {
      const { code: success, data: result } = yield call(orgPopViewApi.getMaxOrgByUserId, { ...payload });
      if (success) {
        const maxOrg = result;
        console.warn(maxOrg)
        const { code, data: res } = yield call(orgPopViewApi.getOrgAndUserByorgId, { orgId: result.orgId });
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
      const { code, data } = yield call(orgPopViewApi.getOrgAndUserByorgId, { ...payload });
      if (code) {
        yield put({
          type: 'updateState',
          payload: {
            list: data.orgDtos
          }
        })
      }
    },

    // 根据组织名称模糊搜索
    * getOrgByOrgName({ payload }, { call, put }) {
      const { code, data } = yield call(orgPopViewApi.getOrgByOrgName, { ...payload });
      if (code) {
        yield put({
          type: 'updateState',
          payload: {
            searchList: data
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
