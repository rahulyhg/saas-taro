import userPopViewApi from '../../../service/userAndOrgUtilService';
import { element } from 'prop-types';
import Taro from '@tarojs/taro'
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
      //Taro.showLoading({ title: '加载中' })
      const { code, data: result } = yield call(userPopViewApi.getMaxOrgByUserId, { ...payload });
      //Taro.hideLoading();
      if (code===1) {
        //const maxOrg = { orgId: result.id, orgName: result.name, orgCode: result.code };
        //const list = [{ orgId: result.id, orgName: result.name, orgCode: result.code }]
        const maxOrg = { orgId: result.orgId, orgName: result.name, orgCode: result.orgCode };
        const list = [{ orgId: result.orgId, orgName: result.name, orgCode: result.orgCode,allUser:result.allUser }]
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
     // Taro.showLoading({ title: '加载中' })
      const { code, data: result } = yield call(userPopViewApi.getMaxOrgByOrgId, { ...payload });
     // Taro.hideLoading();
      if (code==1) {
        const maxOrg = { orgId: result.id, orgName: result.name, orgCode: result.code };
        const list = [{ orgId: result.id, orgName: result.name, orgCode: result.code,allUser:result.allUser }]

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
     // Taro.showLoading({ title: '加载中' })
      const { code: success, data: res } = yield call(userPopViewApi.getOrgAndUserByorgId, { ...payload });
     // Taro.hideLoading();
      if (success === 1) {
        let tempOrgs: any = [];
        res.orgDtos.forEach(element => {
          tempOrgs.push({
            orgId: element.id,
            orgName: element.name,
            orgCode: element.code,
            allUser:element.allUser
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
     // Taro.showLoading({ title: '加载中' })
      const { code: success, data: res } = yield call(userPopViewApi.getUserByUserName, { ...payload });
     // Taro.hideLoading();
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
      //Taro.showLoading({ title: '加载中' })
      const { code: success, data: res } = yield call(userPopViewApi.getOrgAndUserByorgId, { ...payload });
      Taro.hideLoading();
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
