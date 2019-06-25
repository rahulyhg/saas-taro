// import Taro from '@tarojs/taro';
import { imageUpload, findMeetDetailById, getListMeetType, saveMeetSummary, 
	getDetailForSign, findSignUserList, startSign } from '@/src/service/meetService';

export default {
    namespace: 'meetManageDetail',
    state: {},

    effects: {
		// 上传图片类型附件
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
		// 查询会议详情
        *findMeetDetailById({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(findMeetDetailById, payload);
			if(!response){
				return;
			}
			
			if (callback) {
				callback(response);
			}
		},
		// 会议所属组织列表 查询
		*getListMeetType({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(getListMeetType, payload);
			if(!response){
				return;
			}
			
			if (callback) {
				callback(response);
			}
		},
		// 保存会议纪要
		*saveMeetSummary({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(saveMeetSummary, payload);
			if(!response){
				return;
			}
			
			if (callback) {
				callback(response);
			}
		},

		// 获取会议签到和观看视频的详情
		*getDetailForSign({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(getDetailForSign, payload);
			if(!response){
				return;
			}
			
			if (callback) {
				callback(response);
			}
		},
		// 获取已经签到的人员、已经看了视频的人员  两个人员列表公用一个接口
		*findSignUserList({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(findSignUserList, payload);
			if(!response){
				return;
			}
			
			if (callback) {
				callback(response);
			}
		},
		// 开启签到
		*startSign({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(startSign, payload);
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
