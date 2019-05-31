import { Request } from '../../../utils/request'

export default {
	namespace: 'workHome',
	state: {
		data: [],
		key: '72eed010c976e448971655b56fc2324e',
		v: '1.0'
	},

	effects: {
        *login({payload}) {
			console.warn('login', payload)
			Request.login(payload.code) 
		},
	},

	reducers: {
		updateState(state, { payload: data }) {
			return { ...state, ...data }
		}
	}

}