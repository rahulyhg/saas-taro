import { getPageList  } from '../service/coordinationService';


export default {
    namespace: 'coordinationList',
    state: {
    },

    effects: {
        //获取工作协同列表
        * getPageList({ payload, callback }, { select, call, put }){
            const res = yield call(getPageList, payload);
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