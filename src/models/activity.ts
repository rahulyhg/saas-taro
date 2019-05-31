import activityApi from '../service/activityService';
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
            const activity = yield select(state => state.activity);
            activity.customOption = payload.atcList;
            const { code, msg } = yield call(activityApi.addActivity, activity);
            yield put({
                type: 'activityOrg/clearOrgs'
            });
            yield put({
                type: 'activityUser/clearUsers'
            })

            if (code == '1') {
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

    reducers: {
        updateState(state, { payload }) {
            return ({ ...state, ...payload })
        }
    }
}