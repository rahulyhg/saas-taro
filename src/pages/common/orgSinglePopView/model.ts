import orgPopViewApi from '../../../service/userAndOrgUtilService';
import Taro from '@tarojs/taro'
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
      //Taro.showLoading({ title: '加载中' })
      const { code: success, data: result } = yield call(orgPopViewApi.getMaxOrgByUserId, { ...payload });
      //Taro.hideLoading();
      if (success === 1) {
        const maxOrg = {id:result.orgId,name:result.name,code:result.orgCode};
        const list =[{id:result.orgId,name:result.name,code:result.orgCode,shortName: result.shortName ? result.shortName : '',typeId:result.typeId }]
        /*
        const maxOrg = result;
        const { code, data: res } = yield call(orgPopViewApi.getOrgAndUserByorgId, { orgId: result.orgId });
        Taro.hideLoading();
        if (code) {
          yield put({
            type: 'updateState',
            payload: {
              list: res.orgDtos,
              maxOrg: maxOrg
            }
          })
        }
        */
        yield put({
          type: 'updateState',
          payload: {
            list: list,
            maxOrg: maxOrg
          }
        })
      }
    },


    // 获取用户账套最大权限组织&下级组织
    * getTantentOrg({ payload }, { call, put }) {
      const { code: success, data: result } = yield call(orgPopViewApi.getTantentOrg, { ...payload });
      if (success === 1) {
        const maxOrg = {id:result.id,name:result.name,code:result.code};
        const list =[{id:result.id,name:result.name,code:result.code,shortName: result.name,typeId:result.typeId }]
        yield put({
          type: 'updateState',
          payload: {
            list: list,
            maxOrg: maxOrg
          }
        })
      }
    },

    // 根据orgId获取下级组织
    * getOrgAndUserByorgId({ payload }, { call, put }) {
      //Taro.showLoading({ title: '加载中' })
      const { code, data } = yield call(orgPopViewApi.getOrgAndUserByorgId, { ...payload });
      //Taro.hideLoading();
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
      //Taro.showLoading({ title: '加载中' })
      const { code, data } = yield call(orgPopViewApi.getOrgByOrgName, { ...payload });
      //Taro.hideLoading();
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
    },

    clear(state) {
      return ({
        ...state,
        searchList: [],
        maxOrg: {},
        list: [],
        checkedOrg: {}
      })
    }

  }

}
