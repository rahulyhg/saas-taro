import { saveWorkCoordination  } from '../service/coordinationService';


export default {
    namespace: 'coordinationSend',
    state: {
    },

    effects: {
        //获取工作协同列表
        * saveWorkCoordination({ payload, callback }, { select, call, put }){
            const res = yield call(saveWorkCoordination, payload);
            if(callback) {
                return callback(res);
            }
            return res;
        }
    },

    reducers: {
        updateState(state, { payload }) {
            return ({ ...state, ...payload })
        }
    }

}