import { getPartakeDetail, addAnswer, answerResult, answerDetail, 
	editAnswer, saveAnswer, deleteAnswer } from '../service/answerService';
import Taro from '@tarojs/taro'

export default {
	namespace: 'answer',
	state: {
		orgs: [],
		users: [],
		id: '',
		title: '',
		cover: '',
		content: '',
		startTime: '',
		endTime: '',
		peopleJoin: '',
		orgIds: [],
		userIds: [],
		customOptions:[],
		questions:[],

		answerFormData: {},
  	},

  	effects: {

		*getPartakeDetail({ payload, callback }, { call, put }) {
            const res = yield call(getPartakeDetail, payload)
            if (res.code === 1) {
                yield put({
                    type: 'updateState',
                    payload: res.data
                })
			}
			if(callback) {
				return callback(res);
			}
			return res;
		},
		
		*addAnswer({ payload, callback }, { call }) {
			const res = yield call(addAnswer, payload);
			if(callback) {
				return callback(res);
			}
			return res;
		},

		*answerResult({ payload }, { call, put }) {
			const { data, code } = yield call(answerResult, payload);
			if(code == 1 && data.questions && data.questions.length > 0) {
				data.questions.map(question => {
					let tmpAllNum = 0;
					question.answerList.map(answer => {
						tmpAllNum += answer.chooseNum;
					});

					question.answerList.map(answer => {
						tmpAllNum > 0 ? (answer.chooseRate = Math.round(answer.chooseNum * 100 / tmpAllNum))
						: (answer.chooseRate = 0);
					});
				})
			}
            if (code === 1) {
				data.startDate = data.startTime;
				data.endDate = data.endTime;
                yield put({
                    type: 'updateState',
                    payload: { answerResult: data }
                })
            }
		},
		
		*answerDetail({ payload }, { call, put }) {
			const { data, code } = yield call(answerDetail, payload)
			
            if (code === 1) {
				data.startDate = data.startTime;
				data.endDate = data.endTime;
                yield put({
                    type: 'updateState',
                    payload: { answerFormData: data }
                })
            }
		},
		
		*editAnswer({ payload, callback }, { call }) {
			const res = yield call(editAnswer, payload);
			if(callback) {
				return callback(res);
			}
			return res;
		},

		*saveAnswer({ payload, callback }, { call }) {
			const { msg, code } = yield call(saveAnswer, payload);
            if(code=='1'){
                Taro.switchTab({ url: '/pages/eco/home/index' }).then(() => {
                    Taro.showToast({
                        title: msg,
                        icon: 'success',
                        duration: 2000
                    })
                })
            }else{
                Taro.showToast({
                    title: msg,
                    icon: 'none',
                    duration: 2000
                });
            }

		},
		
		*deleteAnswer({ payload, callback }, { call }) {
			const res = yield call(deleteAnswer, payload);
			if(callback) {
				return callback(res);
			}
			return res;
		},
		
  	},

	reducers: {
		updateState(state, { payload }) {
            return ({ ...state, ...payload })
        }
	}

}
