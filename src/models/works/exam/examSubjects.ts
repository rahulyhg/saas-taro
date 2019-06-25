import { getListQuestion, saveExamSubmit } from '@/src/service/examService';

export default {
    namespace: 'examSubjects',
    state: {
    },

    effects: {
        // 获取考试题目及答案接口
        *getListQuestion({ payload, callback }, { call }){
            const response = yield call(getListQuestion, payload);
			if(!response){
				return;
			}
			
			if (callback) {
				callback(response);
			}
        },
        // 交卷
        *saveExamSubmit({ payload, callback }, { call }){
            const response = yield call(saveExamSubmit, payload);
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
