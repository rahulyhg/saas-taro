import { bindPhone, sendMsg } from '@/src/service/loginService'

export default {
    namespace: 'bindAccount',
    state: {
    },

    effects: {
        *submit({ payload, callback }, { call }) {
            const res = yield call(bindPhone, payload)
            if(callback) {
                callback(res)
            }
        },
        *sendMsg({payload}, { call}) {
            yield call(sendMsg, payload)
        }
    },

    reducers: {}

}
