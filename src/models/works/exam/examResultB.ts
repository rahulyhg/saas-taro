import { getMyAnswer, getQuestionData } from '@/src/service/examService';


export default {
    namespace: 'examResultB',
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
        
        // 根据考试id，题目号获取该题目的正确答案，用户答案 
        *getQuestionData({ payload, callback }, { call }){
            const response = yield call(getQuestionData, payload);
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
