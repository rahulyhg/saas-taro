import { getPartakeDetail, addAnswer, answerResult, answerDetail, 
	editAnswer, saveAnswer, deleteAnswer, isPartake } from '../service/answerService';
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

					question.answerList.map(answer => {
						data.joinNum > 0 ? (answer.chooseRate = Math.round(answer.chooseNum * 100 / data.joinNum))
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
			const res = yield call(saveAnswer, payload);
			if(callback) {
				return callback(res);
			}
			return res;
		},
		
		*deleteAnswer({ payload, callback }, { call }) {
			const res = yield call(deleteAnswer, payload);
			if(callback) {
				return callback(res);
			}
			return res;
		},

		*isPartake({ payload, callback }, { call, put }) {
			const { data, code } = yield call(isPartake, payload)
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: { isPartake: data }
                })
            }
		},

		

  	},

	reducers: {
		updateState(state, { payload }) {
            return ({ ...state, ...payload })
		},

		clear(state){
            return({
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
            })
        }
	}

}
