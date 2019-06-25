// import Taro from '@tarojs/taro';
import { imageUpload } from '@/src/service/voteService';

export default {
	namespace: 'addVoteTypesForm',
	state: {
		index: -1, // 第几项 投票项
		cover: '',// 上传的问题
		title: '',// 用户输入的 标题
		remark: '',// 用户输入的 详情
		isDeleteEvt: false, // 是否是点击删除返回的
	},

	effects: {
		*imageUpload({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(imageUpload, payload);
			if (!response) {
				return;
			}

			if (callback) {
				callback(response);
			}
		}
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
