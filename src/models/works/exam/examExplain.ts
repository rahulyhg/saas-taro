import { getDetail, beginExam } from '@/src/service/examService';

export default {
    namespace: 'examExplain',
    state: {},

    effects: {
        // 获取考试详细
        *getDetail({ payload, callback }, { call }){
            const response = yield call(getDetail, payload);
			if(!response){
				return;
			}
			
			if (callback) {
				callback(response);
			}
            
        },
        // 开始答题
        *beginExam({ payload, callback }, { call }){
            const response = yield call(beginExam, payload);
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
