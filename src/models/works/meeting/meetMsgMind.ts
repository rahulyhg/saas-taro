// import Taro from '@tarojs/taro';
import { addMeet, findRelUserList, deleteMeetWithMsg, updateMeet } from  '@/src/service/meetService';

export default {
    namespace: 'meetMsgMind',
    state: {
    },

    effects: {
        // 新增会议
        * addMeet({ payload, callback }, { call }) {
            // response为接口返回值
			const response = yield call(addMeet, payload);
			if(!response){
				return;
            }
            
			if (callback) {
				callback(response);
			}
        },
        // 根据选择的组织和人员查询真实的人员列表
        * findRelUserList({ payload, callback }, { call }) {
            // response为接口返回值
			const response = yield call(findRelUserList, payload);
			if(!response){
				return;
            }
            
			if (callback) {
				callback(response);
			}
        },
		// 会议删除接口 会议状态为 0 或1 时使用，可以发送提醒消息
		*deleteMeetWithMsg({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(deleteMeetWithMsg, payload);
			if(!response){
				return;
			}
			
			if (callback) {
				callback(response);
			}
        },
        // 修改会议
        *updateMeet({ payload, callback }, { call }) {
			// response为接口返回值
			const response = yield call(updateMeet, payload);
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
