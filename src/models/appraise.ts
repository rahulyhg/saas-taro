import { getAppraiseDetail, getPartyResult, getSelfAppraise, getAppraiseState, saveOwnAppraise, 
	getOtherAppraise, getPageList, saveEachAppraisal } from '../service/appraiseService';

export default {
	namespace: 'appraise',
	state: {
		
  	},

  	effects: {
		*getAppraiseDetail({ payload, callback }, { call }) {
			const res = yield call(getAppraiseDetail, payload);
			if(callback) {
				return callback(res);
			}
			return res;
		},

		*getPartyResult({ payload, callback }, { call }) {
			const res = yield call(getPartyResult, payload);
			if(callback) {
				return callback(res);
			}
			return res;
		},

		*getSelfAppraise({ payload, callback }, { call }) {
			const res = yield call(getSelfAppraise, payload);
			if(callback) {
				return callback(res);
			}
			return res;
		},

		*getAppraiseState({ payload, callback }, { call }) {
			const res = yield call(getAppraiseState, payload);
			if(callback) {
				return callback(res);
			}
			return res;
		},

		*saveOwnAppraise({ payload, callback }, { call }) {
			const res = yield call(saveOwnAppraise, payload);
			if(callback) {
				return callback(res);
			}
			return res;
		},

		*getOtherAppraise({ payload, callback }, { call }) {
			const res = yield call(getOtherAppraise, payload);
			if(callback) {
				return callback(res);
			}
			return res;
		},

		*getPageList({ payload, callback }, { call }) {
			const res = yield call(getPageList, payload);
			if(callback) {
				return callback(res);
			}
			return res;
		},

		*saveEachAppraisal({ payload, callback }, { call }) {
			const res = yield call(saveEachAppraisal, payload);
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
