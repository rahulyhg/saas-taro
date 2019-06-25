import { getPageList, getMyPageList, getActionPageList, getDetail, addEco } from '../../../service/ecoService';
import { savePraise, canclePraise, forward } from '../../../service/praiseService';
import { delComment, addComment, addReply, replyComment } from '../../../service/commentService';

export default {
  namespace: 'eco',
  state: {
    tabCurrent: 0
  },

  effects: {
    *getPageList({ payload, callback }, { select, call, put }) {
        const res = yield call(getPageList, payload);
        if(callback) {
            return callback(res);
        }
        return res;
    },

    *getMyPageList({ payload, callback }, { select, call, put }) {
        const res = yield call(getMyPageList, payload);
        if(callback) {
            return callback(res);
        }
        return res;
    },

    *getActionPageList({ payload, callback }, { select, call, put }) {
        const res = yield call(getActionPageList, payload);
        if(callback) {
            return callback(res);
        }
        return res;
    },

    *savePraise({ payload, callback }, { select, call, put }) {
        const res = yield call(savePraise, payload);
        if(callback) {
            return callback(res);
        }
        return res;
    },

    *canclePraise({ payload, callback }, { select, call, put }) {
      const res = yield call(canclePraise, payload);
      if(callback) {
          return callback(res);
      }
      return res;
    },

    *forward({ payload, callback }, { select, call, put }) {
      const res = yield call(forward, payload);
      if(callback) {
          return callback(res);
      }
      return res;
    },

    *delComment({ payload, callback }, { select, call, put }) {
      const res = yield call(delComment, payload);
      if(callback) {
          return callback(res);
      }
      return res;
    },

    *addComment({ payload, callback }, { select, call, put }) {
      const res = yield call(addComment, payload);
      if(callback) {
          return callback(res);
      }
      return res;
    },

    *addReply({ payload, callback }, { select, call, put }) {
      const res = yield call(addReply, payload);
      if(callback) {
          return callback(res);
      }
      return res;
    },

    *replyComment({ payload, callback }, { select, call, put }) {
      const res = yield call(replyComment, payload);
      if(callback) {
          return callback(res);
      }
      return res;
    },

    *getDetail({ payload, callback }, { select, call, put }) {
        const res = yield call(getDetail, payload);
        if(callback) {
            return callback(res);
        }
        return res;
    },

    *addEco({ payload, callback }, { select, call, put }) {
        const res = yield call(addEco, payload);
        if(callback) {
            return callback(res);
        }
        return res;
    },

    *updateTabCurrent({ payload, callback }, { select, call, put }) {
        yield put({
            type: 'updateState',
            payload: { tabCurrent: payload.tabCurrent }
        })
    }

    
  },

  reducers: {
    updateState(state, { payload }) {
        return ({ ...state, ...payload })
    }
  }

}
