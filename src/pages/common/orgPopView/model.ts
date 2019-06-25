import orgPopViewApi from '../../../service/userAndOrgUtilService';
import Taro from '@tarojs/taro'
export default {
  namespace: 'orgPopView',
  state: {
    maxOrg: {},
    orgList: [],

    checkedList: [],
    checkedOrgList: [],
    searchOrgList: []
  },

  effects: {

    // 获取用户管理最大权限组织&下级组织
    * getMaxOrgByUserId({ payload }, { call, put }) {
      //Taro.showLoading({ title: '加载中' })
      const { code: success, data: result } = yield call(orgPopViewApi.getMaxOrgByUserId, { ...payload });
      //Taro.hideLoading();
      if (success === 1) {
        const temp = {
          orgId: result.orgId,
          shortName: result.shortName,
          orgName: result.name,
          orgCode: result.orgCode,
          typeId: result.typeId,
          checked: false
        }
        let orgList: any = [];
        orgList.push(temp);
        yield put({
          type: 'updateState',
          payload: {
            orgList: orgList,
            maxOrg: temp
          }
        })
      }
    },


    // 获取用户管理最大权限组织&下级组织 ByOrgId
    * getMaxOrgByOrgId({ payload }, { call, put }) {
     // Taro.showLoading({ title: '加载中' })
      const { code: success, data: result } = yield call(orgPopViewApi.getMaxOrgByOrgId, { ...payload });
      //Taro.hideLoading();
      if (success === 1) {
        const temp = {
          orgId: result.id,
          shortName: result.shortName,
          orgName: result.name,
          orgCode: result.code,
          typeId: result.typeId,
          checked: false
        }
        let orgList: any = [];
        orgList.push(temp);
        yield put({
          type: 'updateState',
          payload: {
            orgList: orgList,
            maxOrg: temp
          }
        })
      }
    },

    // 根据orgId获取下级组织
    * getOrgAndUserByorgId({ payload }, { call, put }) {
      //Taro.showLoading({ title: '加载中' })
      const { code, data: res } = yield call(orgPopViewApi.getOrgAndUserByorgId, { ...payload });
      //Taro.hideLoading();
      if (code === 1) {
        let temp: any = [];
        res.orgDtos.forEach(element => {
          temp.push({
            orgId: element.id,
            shortName: element.shortName,
            orgName: element.name,
            orgCode: element.code,
            typeId: element.typeId,
            checked: false
          })
        });
        yield put({
          type: 'updateState',
          payload: {
            orgList: temp
          }
        })
      }
    },

    // 根据组织名称模糊搜索
    * getOrgByOrgName({ payload }, { call, put }) {
      //Taro.showLoading({ title: '加载中' })
      const { code, data: res } = yield call(orgPopViewApi.getOrgByOrgName, { ...payload });
     // Taro.hideLoading();
      if (code === 1) {
        let temp: any = [];
        res.forEach(element => {
          temp.push({
            orgId: element.id,
            shortName: element.shortName,
            orgName: element.name,
            orgCode: element.code,
            typeId: element.typeId,
            checked: false
          })
        });
        yield put({
          type: 'updateState',
          payload: {
            searchOrgList: temp
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
