import { getPageList, getDetail } from '@/src/service/examService';

export default {
    namespace: 'examList',
    state: {
    },

    effects: {
        // 获取考试列表
        *getPageList({ payload, callback }, { call }){
            const response = yield call(getPageList, payload);
			if(!response){
				return;
			}
			
			if (callback) {
				callback(response);
			}
        },
        // 获取详情
        *getDetail({ payload, callback }, { call }){
            const response = yield call(getDetail, payload);
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
