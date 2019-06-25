// import Taro from '@tarojs/taro';
import { saveWatchRecord, getPullUrlByMeetId } from '@/src/service/meetService';

export default {
    namespace: 'meetLivePlayer',
    state: {
    },

    effects: {
        // 新增观看记录
        *saveWatchRecord({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(saveWatchRecord, payload);
			if(!response){
				return;
			}
			
			if (callback) {
				callback(response);
			}
        },
        // 个人访问返回直播状态和播流地址 -- 看直播
        *getPullUrlByMeetId({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(getPullUrlByMeetId, payload);
			if(!response){
				return;
			}
			
			if (callback) {
				callback(response);
			}
		},
    },

    reducers: {
        
    }

}
