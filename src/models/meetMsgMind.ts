// import Taro from '@tarojs/taro';
import { addMeet, findRelUserList } from  '../service/meetService';

export default {
    namespace: 'meetMsgMind',
    state: {
    },

    effects: {
        * addMeet({ payload, callback }, { call }) {
            // response为接口返回值
			const response = yield call(addMeet, payload);
			if(!response){
				return;
            }
            
			if (callback) {
				callback(response);
			}
        },
        * findRelUserList({ payload, callback }, { call }) {
            // response为接口返回值
			const response = yield call(findRelUserList, payload);
			if(!response){
				return;
            }
            
			if (callback) {
				callback(response);
			}
        },
    },

    reducers: {}

}
