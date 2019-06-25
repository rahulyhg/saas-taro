// import Taro from '@tarojs/taro';
import { getListForPerson, getListMeetType } from '@/src/service/meetService';

export default {
    namespace: 'meetUserList',
    state: {
    },

    effects: {
        * getListForPerson({ payload, callback }, { call }) {
            // response为接口返回值
			const response = yield call(getListForPerson, payload);
			if(!response){
				return;
            }
            
			if (callback) {
				callback(response);
			}
        },
        * getListMeetType({ payload, callback }, { call }) {
            // response为接口返回值
			const response = yield call(getListMeetType, payload);
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
