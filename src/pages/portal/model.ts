import { noLogin } from '@/src/service/loginService'
import { getDetail } from '@/src/service/sysDictService'

export default {
    namespace: 'portal',
    state: {

        /** WEAPP | ALIPAY | DINGTALK */
        appType: '',

        /** 小程序授权code */
        authCode: '',

        /** 系统配置项、数据字典 */
        dictionary: {}
    },
  
    effects: {
        *getSysDic({}, {call, put}) {
            const res = yield [
                call(getDetail, { typeCode: 'mini_live_broadcast' }),
            ]

            yield put({
                type: 'setDictionary',
                payload: res
            })
            console.warn('getSysDic', res)
        },
        *noLogin({ payload, callback }, { select, call, put }) {
            const res = yield call(noLogin, {
                terminal: payload.appType,
                authCode: payload.authCode,
                redirect: payload.redirect,
            })
            if(callback) {
                callback(res)
            }

            yield put({
                type: 'setAppType', 
                payload: {
                    appType: payload.appType,
                    authCode: payload.authCode,
                }
            })
        }
    },
  
    reducers: {
        setDictionary(state, {payload}) {
            let dictionary = {}
            payload.map(item => {
                const { data: { name, typeCode, typeName } } = item
                dictionary = {...dictionary, ...{
                    [typeCode]: {
                        name: JSON.parse(name),
                        typeCode,
                        typeName,
                    }
                }}
            })
            console.warn(dictionary)
            return ({
                ...state,
                dictionary,
            })
        },
        setAppType(state, {payload}) {
            return ({
                ...state,
                appType: payload.appType,
                authCode: payload.authCode,
            })
        }
    }
  
  }
  