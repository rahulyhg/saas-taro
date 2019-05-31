// import Taro from '@tarojs/taro';
// import * as demoApi from './service';

export default {
  namespace: 'demo',
  state: {
  },

  effects: {
    * getOrgList(){

    }
  },

  reducers: {
    updateState(state,{payload:list}){
      return {...state,...list,type:'user'}
    }
  }

}
