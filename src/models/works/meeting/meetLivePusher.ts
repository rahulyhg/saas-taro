// import Taro from '@tarojs/taro';
import { getAliyunLive, endLive, continueRecording } from '@/src/service/meetService';

export default {
    namespace: 'meetLivePusher',
    state: {
    },

    effects: {
        // 开启直播
        *getAliyunLive({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(getAliyunLive, payload);
			if(!response){
				return;
			}
			
			if (callback) {
				callback(response);
			}
        },
        // 结束直播
        *endLive({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(endLive, payload);
			if(!response){
				return;
			}
			
			if (callback) {
				callback(response);
			}
        },
        // 继续直播
        *continueRecording({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(continueRecording, payload);
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
