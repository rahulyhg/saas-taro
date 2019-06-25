import { getPageList, addFlowIn, addFlowOut, 
	getOneById, flowback } from '../service/turnoverService';

export default {
	namespace: 'turnover',
	state: {
		isRefresh: false,
  	},

  	effects: {
		*getPageList({ payload, callback }, { call, put }) {
			const res = yield call(getPageList, payload);
			if(callback) {
				yield put({
                    type: 'updateState',
                    payload: {
                        isRefresh: false
                    }
                })
				return callback(res);
			}
			return res;
		},

		*addFlowIn({ payload, callback }, { call, put }) {
			const res = yield call(addFlowIn, payload);
			if(callback) {
				yield put({
                    type: 'updateState',
                    payload: {
                        isRefresh: true
                    }
                })
				return callback(res);
			}
			return res;
		},

		*addFlowOut({ payload, callback }, { call, put }) {
			const res = yield call(addFlowOut, payload);
			if(callback) {
				yield put({
                    type: 'updateState',
                    payload: {
                        isRefresh: true
                    }
                })
				return callback(res);
			}
			return res;
		},

		*getOneById({ payload, callback }, { call }) {
			const res = yield call(getOneById, payload);
			if(callback) {
				return callback(res);
			}
			return res;
		},

		*flowback({ payload, callback }, { call }) {
			const res = yield call(flowback, payload);
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
