import surveyApi from '../../../service/surveyService';
import Taro from '@tarojs/taro'
export default {
    namespace: 'surveyEdit',
    state: {
        surveyFormData: {

        },
        surveyResult:{}

    },

    effects: {

        * surveyDetail({ payload }, { call, put }) {
            const { data, code } = yield call(surveyApi.surveyDetail, payload)
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: { surveyFormData: data }
                })
            }
            console.log(data, code)
        },

        * edit({ payload }, { call, put }) {
            const { data, code } = yield call(surveyApi.editSurvey, payload)
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: { surveyFormData: data }
                });
                Taro.showToast({
                    title:'编辑成功',
                    duration:2000
                })
                
            }else{
                Taro.showToast({
                    title:'编辑失败',
                    duration:2000
                })
            }
            
        },

        * surveyResult({ payload }, { call, put }) {
            const { data, code } = yield call(surveyApi.surveyResult, payload)
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: { surveyResult: data }
                })
            }
            console.log(data, code)
        }



    },

    reducers: {
        updateState(state, { payload }) {
            return ({ ...state, ...payload })
        }
    }
}