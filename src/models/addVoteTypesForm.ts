// import Taro from '@tarojs/taro';
import {imageUpload} from '../service/voteService';

export default {
    namespace: 'addVoteTypesForm',
    state: {
        cover: '',// 上传的问题
        title: '',// 用户输入的 标题
        remark: '',// 用户输入的 详情
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
		}
    },

    reducers: {
        saveData(state, {payload}) {
			return {
				...state,
				...payload,
			};
		},
    }

}
