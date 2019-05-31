import surveyApi from '../service/surveyService';
import Taro from '@tarojs/taro'
export default {
    namespace: 'surveyJoin',
    state: {
        isPartake:false 
    },

    effects: {

        * getPartakeDetail({ payload }, { call, put }) {
            const { data, code } = yield call(surveyApi.getPartakeDetail, payload)
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: data
                })
            }
        },

        * getMyPartakeDetail({ payload }, { call, put }) {
            const { data, code } = yield call(surveyApi.getMyPartakeDetail, payload)
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: data
                })
            }
            
        },

        * saveAnswer({ payload }, { call }) {
            const { msg, code } = yield call(surveyApi.saveAnswer, payload)
            if(code=='1'){
                Taro.switchTab({ url: '/pages/eco/home/index' }).then(() => {
                    Taro.showToast({
                        title: msg,
                        icon: 'success',
                        duration: 2000
                    })
                })
            }else{
                Taro.showToast({
                    title: msg,
                    icon: 'none',
                    duration: 2000
                });
            }

        },

        * getAnswerValueList({ payload }, { call, put }) {
            const { data, code } = yield call(surveyApi.getAnswerValueList, payload)
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: { answerValueList: data }
                })
            }

        },
        * isPartake({ payload }, { call, put }) {
            const { data, code } = yield call(surveyApi.isPartake, payload)
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: { isPartake: data }
                })
            }

        },
       


    },

    reducers: {
        updateState(state, { payload }) {
            return ({ ...state, ...payload })
        }
    }
}