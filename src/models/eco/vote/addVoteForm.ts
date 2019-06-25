// import Taro from '@tarojs/taro';
import { imageUpload, addVote } from '@/src/service/voteService';

export default {
	namespace: 'addVoteForm',
	state: {
		activityOption: []
  	},

  	effects: {
		*imageUpload({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(imageUpload, payload);
			if(!response){
				return;
			}
			
			if (callback) {
				callback(response);
			}
		},
		*addVote({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(addVote, payload);
			if(!response){
				return;
			}
			
			if (callback) {
				callback(response);
			}
		},
  	},

	reducers: {
		saveData(state, { payload }) {
			return {
				...state,
				...payload,
			};
		},
	}

}
