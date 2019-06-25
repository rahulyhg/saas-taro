import Taro from '@tarojs/taro';
import activityApi from '../../../service/activityService';

export default {
    namespace: 'activityDetail',
    state: {
        activityDetail: {},
        staffList: {}
    },
    effects: {
        * getActivityById({ payload }, { call, put }) {
            // response为接口返回值
            const delay = (ms) => new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
            //yield call(delay, 3000)
            const { code, data } = yield call(activityApi.getActivityById, payload);
            console.log(data)
            if (code === 1) {

                yield put({
                    type: 'updateState',
                    payload: {
                        activityDetail: data
                    }
                })
            }

        },

        * deleteActivityById({ payload }, { call }) {
            // response为接口返回值
            const { code, msg } = yield call(activityApi.deleteActivityById, payload);
            if (code === 1) {
                Taro.switchTab({ url: '/pages/eco/home/index' }).then(() => {
                    Taro.showToast({
                        title: msg,
                        icon: 'success',
                        duration: 2000
                    })
                })
            } else {
                Taro.showToast({
                    title: msg,
                    duration: 2000,
                    icon: 'none'
                });
            }


        },

        * morePeopleById({ payload }, { call, put }) {
            // response为接口返回值
            const delay = (ms) => new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
           // yield call(delay, 3000)
            const { code, data } = yield call(activityApi.morePeopleById, payload);
            console.log(data)
            if (code === 1) {

                yield put({
                    type: 'updateState',
                    payload: {
                        staffList: data
                    }
                })
            }

        }
    },

    reducers: {
        updateState(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    }

}
