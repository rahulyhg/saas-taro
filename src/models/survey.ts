import surveyApi from '../service/surveyService';
import Taro from '@tarojs/taro'
export default {
    namespace: 'survey',
    state: {
        id: '',
        title: '',
        coverId: '',
        cover: '',
        content: '',
        startDate: '',
        endDate: '',
        peopleJoin: '0',
        orgs: [],
        users: [],
        redNeed: '',
        redTotalNum: '',
        redMoney: '',
        redTotal: '',
        redPayTotal: '',
        redPlatform: 0,
        customOptions: [],
        questions: []
    },

    effects: {


        * addSurvey({ payload }, { call, select,put }) {
            let survey = yield select(state => state.survey);
            survey = {
                ...survey,
                ...payload
            }
            const { msg, code } = yield call(surveyApi.addSurvey, survey)
            if(code=='1'){
                yield put({
                    type:'activityOrg/clearOrgs'
                });
                yield put({
                    type:'activityUser/clearUsers'
                })
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

        * getSurveyDetail({ payload }, { call, put }) {
            const { res, code } = yield call(surveyApi.surveyDetail, payload)
            if (code === 1) {
                yield put({
                    type: 'updateState',
                    payload: res.data
                })
            }
            console.log(res, code)
        }



    },

    reducers: {
        updateState(state, { payload }) {
            return ({ ...state, ...payload })
        }
    }
}