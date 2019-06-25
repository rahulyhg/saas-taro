import activityApi from '../../../service/activityService';
import Taro from '@tarojs/taro'
export default {
    namespace: 'activity',
    state: {
        id: '',
        title: '',
        cover: '',
        content: '',
        startTime: '',
        endTime: '',
        peopleJoin: '',
        joinOrg: [],
        joinUser: [],
        customOption: [],
    },

    effects: {
        // todo 清除选人 选组织
        * addActivity({ payload }, { call, select, put }) {
            Taro.showLoading({
                title:'提交中',
                mask:true
            })
            const activity = yield select(state => state.activity);
            activity.customOption = payload.atcList;
            const { code, msg } = yield call(activityApi.addActivity, activity);
            Taro.hideLoading();
            /*
            yield put({
                type: 'activityOrg/clearOrgs'
            });
            yield put({
                type: 'activityUser/clearUsers'
            })

            yield put({
                type: 'orgPopView/clearOrgs'
            });
            yield put({
                type: 'userPopView/clearUsers'
            })*/


            if (code == '1') {
                Taro.switchTab({
                    url: '/pages/eco/home/index',
                    success: function () {
                        console.error("success",Taro.getCurrentPages())
                    }
                }).then(() => {
                    console.error("promise",Taro.getCurrentPages())
                    Taro.showToast({
                        title: msg,
                        icon: 'success',
                        duration: 2000
                    });

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
        updateState(state, { payload }) {
            return ({ ...state, ...payload })
        }
    }
}