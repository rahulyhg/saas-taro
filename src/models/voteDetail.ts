// import Taro from '@tarojs/taro';
import { voteDetail, goVote, voteMoreDetail } from  '../service/voteService';

export default {
    namespace: 'voteDetail',

    state: {

    },

    effects: {
      *voteDetail({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(voteDetail, payload);
			if(!response){
				return;
			}
			
			if (callback) {
				callback(response);
			}
		},
		*goVote({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(goVote, payload);
			if(!response){
				return;
			}
			
			if (callback) {
				callback(response);
			}
		},
		*voteMoreDetail({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(voteMoreDetail, payload);
			if(!response){
				return;
			}
			
			if (callback) {
				callback(response);
			}
		},

  	},

    reducers: {
		saveData(state, action) {
			return {
				...state,
				...action.payload,
			};
		},
	}

}
