// import Taro from '@tarojs/taro';
import { activityResult, activityDetail, activityEdit, sumbitActivityEnter } from '../../../service/activityEnterAddAndResult';
import Taro from '@tarojs/taro'
export default {
    namespace: 'actEditAndResult',
    state: {
        activityFormData: {}
    },
    effects: {
        * activityResult({ payload, callback }, { call }) {
            // response为接口返回值
            const response = yield call(activityResult, payload);
            if (!response) {
                return;
            }

            if (callback) {
                callback(response);
            }
        },

        * activityDetail({ payload }, { call, put }) {
            // response为接口返回值
            const { code, data } = yield call(activityDetail, payload);
            if (code === 1) {
                yield put({
                    type: 'saveData',
                    payload: { activityFormData: data }
                })
            }

        },

        * activityEdit({ payload }, { call }) {
            // response为接口返回值
            const { code, msg } = yield call(activityEdit, payload);
            if (code === 1) {
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
                        icon: 'none',
                        duration: 2000
                    });
                }
            }

        },

        * sumbitActivityEnter({ payload }, { call }) {
            // response为接口返回值
            Taro.showLoading({
                title:'提交中',
                mask:true
            })
            const { code, msg } = yield call(sumbitActivityEnter, payload);
            Taro.hideLoading();
            if (code === 1) {
                Taro.redirectTo({ url: '/subPackageEco/pages/activity/detail/index?id=' + payload.activityId }).then(() => {
                    Taro.showToast({
                        title: msg,
                        icon: 'success',
                        duration: 2000
                    })
                })
            } else {
                Taro.showToast({
                    title: msg,
                    icon: 'none',
                    duration: 2000
                });
            }
            

        }
    },

    reducers: {
        saveData(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
    }

}
