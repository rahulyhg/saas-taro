import { findMeetDetailById, getRecordUrl, doSign, getPullUrlByMeetId } from '../service/meetService';

export default {
    namespace: 'meetUserDetail',
    state: {
    },

    effects: {
        // 
        * findMeetDetailById({ payload, callback }, { call }) {
            // response为接口返回值
			const response = yield call(findMeetDetailById, payload);
			if(!response){
				return;
            }
            
			if (callback) {
				callback(response);
			}
        },
        // 返回回放地址
        * getRecordUrl({ payload, callback }, { call }) {
            // response为接口返回值
			const response = yield call(getRecordUrl, payload);
			if(!response){
				return;
            }
            
			if (callback) {
				callback(response);
			}
        },
        // 签到接口
        * doSign({ payload, callback }, { call }) {
            // response为接口返回值
			const response = yield call(doSign, payload);
			if(!response){
				return;
            }
            
			if (callback) {
				callback(response);
			}
        },
        // 个人访问返回直播状态和播流地址
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

    reducers: {}

}
