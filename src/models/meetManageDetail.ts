// import Taro from '@tarojs/taro';
import {imageUpload} from '../service/meetService';

export default {
    namespace: 'meetManageDetail',
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
    },

    reducers: {}

}
