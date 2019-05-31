import userPopViewApi from '../../../service/userAndOrgUtilService';
import { element } from 'prop-types';
export default {
  namespace: 'userPopView',
  state: {
    orgList: [],
    userList: [],
    searchUserList: [],
    checkedOrgList: [],
    checkedUserList: [],
    // 用于页面取值
    checkedList: [],
    orgUserList: []
  },

  effects: {

    // 获取用户管理最大权限组织&下级组织
    * getMaxOrgByUserId({ payload }, { call, put }) {
      const { code, data: result } = yield call(userPopViewApi.getMaxOrgByUserId, { ...payload });
      if (code) {
        const maxOrg = result;
        const { code: success, data: res } = yield call(userPopViewApi.getOrgAndUserByorgId, { orgId: maxOrg.orgId });

        if (success) {
          yield put({
            type: 'updateState',
            payload: {
              orgList: res.orgDtos,
              userList: res.userDtos,
              maxOrg: { id: maxOrg.orgId, name: maxOrg.name }
            }
          })
        }
      }
    },

    // 根据传入组织&下级组织
    * getMaxOrgByOrgId({ payload }, { call, put }) {
      const { code, data: result } = yield call(userPopViewApi.getMaxOrgByOrgId, { ...payload });
      if (code) {
        const maxOrg = result;
        const { code: success, data: res } = yield call(userPopViewApi.getOrgAndUserByorgId, { orgId: maxOrg.orgId });

        if (success) {
          yield put({
            type: 'updateState',
            payload: {
              orgList: res.orgDtos,
              userList: res.userDtos,
              maxOrg: { id: maxOrg.orgId, name: maxOrg.name }
            }
          })
        }
      }
    },

    // 根据orgId获取下级组织
    * getOrgAndUserByorgId({ payload }, { call, put }) {
      const { code: success, data: res } = yield call(userPopViewApi.getOrgAndUserByorgId, { ...payload });
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            orgList: res.orgDtos,
            userList: res.userDtos
          }
        })
      }
    },

    // 根据用户名称模糊搜索
    * getUserByUserName({ payload }, { call, put }) {
      const { code: success, data: res } = yield call(userPopViewApi.getUserByUserName, { ...payload });
      if (success) {
        res && res.map(element => {
          element.checked = false;
        })
        yield put({
          type: 'updateState',
          payload: {
            searchUserList: res
          }
        })
      }
    },

    // 根据orgId获取用户
    * getUserByorgId({ payload }, { call, put }) {
      const { code: success, data: res } = yield call(userPopViewApi.getOrgAndUserByorgId, { ...payload });
      if (success) {
        yield put({
          type: 'updateOrgUserList',
          payload: {
            orgUserList: res.userDtos
          }
        })
      }
    }
  },

  reducers: {
    updateState(state, { payload }) {
      payload.orgList && payload.orgList.map(element => {
        element.checked = false
      })
      payload.userList && payload.userList.map(element => {
        element.checked = false
      })
      return ({ ...state, ...payload })
    },

    updateOrgUserList(state, { payload }) {
      return ({ ...state, ...payload })
    },

    clearUsers() {
      return ({
        orgList: [],
        userList: [],
        searchUserList: [],
        checkedOrgList: [],
        checkedUserList: [],
        checkedList: [],
        orgUserList: []
      })
    }

  }

}
