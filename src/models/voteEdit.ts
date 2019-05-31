// import Taro from '@tarojs/taro';
import { imageUpload, editVote, voteEditDetail, deleteVote } from  '../service/voteService';

export default {
    namespace: 'voteEdit',

    state: {

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
		*editVote({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(editVote, payload);
			if(!response){
				return;
			}
			
			if (callback) {
				callback(response);
			}
        },
        *voteEditDetail({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(voteEditDetail, payload);
			if(!response){
				return;
			}
			
			if (callback) {
				callback(response);
			}
        },
        *deleteVote({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(deleteVote, payload);
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
