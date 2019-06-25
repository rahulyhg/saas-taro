import { listDynamic, listComment, addComment, replayComment, replayReplay,
     listFile, imageUpload, uploadFile, deleteFile, deleteReply , 
     deleteWorkCoordination , updateWorkCoordination , getWorkCoordinationDetail } from '../service/coordinationService';

export default {
    namespace: 'coordinationModel',
    state: {
        imageList:[]
    },

    effects: {
        *listDynamic({ payload, callback }, { call }) {
            const response = yield call(listDynamic, payload);
            if (!response) {
                return;
            }

            if (callback) {
                callback(response);
            }
        },
        *listComment({ payload, callback }, { call }) {
            const response = yield call(listComment, payload);
            if (!response) {
                return;
            }

            if (callback) {
                callback(response);
            }
        },
        *addComment({ payload, callback }, { select, call, put }) {
            const res = yield call(addComment, payload);
            if (callback) {
                return callback(res);
            }
            return res;
        },
        *replayComment({ payload, callback }, { select, call, put }) {
            const res = yield call(replayComment, payload);
            if (callback) {
                return callback(res);
            }
            return res;
        },
        *replayReplay({ payload, callback }, { select, call, put }) {
            const res = yield call(replayReplay, payload);
            if (callback) {
                return callback(res);
            }
            return res;
        },

        *deleteWorkCoordination({ payload, callback }, { select, call, put }) {
            const res = yield call(deleteWorkCoordination, payload);
            if (callback) {
                return callback(res);
            }
            return res;
        },

        *updateWorkCoordination({ payload, callback }, { select, call, put }) {
            const res = yield call(updateWorkCoordination, payload);
            if (callback) {
                return callback(res);
            }
            return res;
        },
        *listFile({ payload, callback }, { call }) {
            const response = yield call(listFile, payload);
            if (!response) {
                return;
            }

            if (callback) {
                callback(response);
            }
        },
        *imageUpload({ payload, callback }, { call }) {
            // responseΪ�ӿڷ���ֵ
            const response = yield call(imageUpload, payload);
            if (!response) {
                return;
            }

            if (callback) {
                callback(response);
            }
        },
        *uploadFile({ payload, callback }, { call }) {
            const res = yield call(uploadFile, payload);
            if (callback) {
                return callback(res);
            }
            return res;
        },
        *deleteFile({ payload, callback }, { call }) {
            const res = yield call(deleteFile, payload);
            if (callback) {
                return callback(res);
            }
            return res;
        },
        *deleteReply({ payload, callback }, { call }) {
            const res = yield call(deleteReply, payload);
            if (callback) {
                return callback(res);
            }
            return res;
        },

        *getWorkCoordinationDetail({ payload, callback }, { call }) {
            const res = yield call(getWorkCoordinationDetail, payload);
            if (callback) {
                return callback(res);
            }
            return res;
        },
    },

    reducers: {
        updateData(state, { payload }) {
            return ({ ...state, ...payload })
        }
    }
}
