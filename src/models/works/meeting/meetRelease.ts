// import Taro from '@tarojs/taro';
import { getListMeetType } from  '@/src/service/meetService';

export default {
    namespace: 'meetRelease',
    state: {
    },

    effects: {
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

    reducers: {
        saveData(state, {payload}) {
			return {
				...state,
				...payload,
			};
		},
    }

}
