import { getMyAnswer } from '@/src/service/examService';

export default {
    namespace: 'examResultA',
    state: {
    },

    effects: {
        // 获取考试题目及答案接口
        *getMyAnswer({ payload, callback }, { call }){
            const response = yield call(getMyAnswer, payload);
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
