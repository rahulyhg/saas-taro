import userSinglePopViewApi from '../../../service/userAndOrgUtilService';
import { element } from 'prop-types';
import userPopViewApi from '../../../service/userAndOrgUtilService';
export default {
  namespace: 'userSinglePopView',
  state: {
    orgList: [],
    userList: [],
    searchUserList: [],
    checkedOrgList: [],
    checkedUserList: [],
    orgUserList: [],
    checkedUser: {}
  },

  effects: {

    // 获取用户管理最大权限组织&下级组织
    * getMaxOrgByUserId({ payload }, { call, put }) {
      const { code, data: result } = yield call(userPopViewApi.getMaxOrgByUserId, { ...payload });
      if (code===1) {
        //const maxOrg = { orgId: result.id, orgName: result.name, orgCode: result.code };
        //const list = [{ orgId: result.id, orgName: result.name, orgCode: result.code }]
        const maxOrg = { orgId: result.orgId, orgName: result.name, orgCode: result.orgCode };
        const list = [{ orgId: result.orgId, orgName: result.name, orgCode: result.orgCode }]
        yield put({
          type: 'updateState',
          payload: {
            orgList: list,
            userList: [],
            maxOrg: maxOrg
          }
        })
      }
    },

    // 根据传入组织&下级组织
    * getMaxOrgByOrgId({ payload }, { call, put }) {
      const { code, data: result } = yield call(userPopViewApi.getMaxOrgByOrgId, { ...payload });
      if (code==1) {
        const maxOrg = { orgId: result.id, orgName: result.name, orgCode: result.code };
        const list = [{ orgId: result.id, orgName: result.name, orgCode: result.code }]

        if (code === 1) {
          yield put({
            type: 'updateState',
            payload: {
              orgList: list,
              userList: [],
              maxOrg: maxOrg
            }
          })
        }


      }
    },

    // 根据orgId获取下级组织
    * getOrgAndUserByorgId({ payload }, { call, put }) {
      const { code: success, data: res } = yield call(userPopViewApi.getOrgAndUserByorgId, { ...payload });
      if (success === 1) {
        let tempOrgs: any = [];
        res.orgDtos.forEach(element => {
          tempOrgs.push({
            orgId: element.id,
            orgName: element.name,
            orgCode: element.code
          })
        });
        let tempUsers: any = [];
        res.userDtos.forEach(element => {
          tempUsers.push({
            userId: element.id,
            partyUserId:element.partyUserId,
            userName: element.userName,
            avatar: element.avatar,
            mobilePhone: element.mobilePhone
          })
        });
        yield put({
          type: 'updateState',
          payload: {
            orgList: tempOrgs,
            userList: tempUsers
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
      if (success === 1) {

        let tempUsers: any = [];
        res.userDtos.forEach(element => {
          tempUsers.push({
            userId: element.id,
            partyUserId: element.partyUserId,
            userName: element.userName,
            avatar: element.avatar,
            mobilePhone: element.mobilePhone
          })
        });


        yield put({
          type: 'updateOrgUserList',
          payload: {
            orgUserList: tempUsers
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
    clear(state) {
      return ({
        ...state,
        orgList: [],
        userList: [],
        searchUserList: [],
        checkedOrgList: [],
        checkedUserList: [],
        orgUserList: [],
        checkedUser: {}
      })
    }

  }

}
