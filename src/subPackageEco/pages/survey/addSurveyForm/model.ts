// import Taro from '@tarojs/taro';
// import * as addVoteFormApi from './service';

export default {
    namespace: 'addAnswerForm',
    state: {
        // 用户自定义选项
        customList:[]
    },

    effects: {},

    reducers: {
        updateState(state,{payload}){
            this.setState({
                ...state,
                payload
            })
        }
    }

}
