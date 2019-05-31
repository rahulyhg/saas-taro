// import Taro from '@tarojs/taro';
// import * as addVoteFormApi from './service';

export default {
    namespace: 'addActForm',
    state: {
        atcList:[],
        needHandle:false,
        isEdit:'0',
        optionItem :{
            must:'0'
        }
    },

    effects: {},

    reducers: {
        updateState(state,{payload}){
            return ({...state,...payload})
        }
    }

}
