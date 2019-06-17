// import Taro from '@tarojs/taro';
// import * as demoApi from './service';

export default {
  namespace: 'demo',
  state: {
    name:'123'
  },

  effects: {},

  reducers: {
    update(state,{payload}){
      return ({
        ...state,
        ...payload
      })
    }
  }

}
