import { getListForMgr,getListMeetType } from '@/src/service/meetService';

export default {
    namespace: 'meetManageList',
    state: {
    },

    effects: {
        * getListForMgr({ payload, callback }, { call }) {
            // response为接口返回值
			const response = yield call(getListForMgr, payload);
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
