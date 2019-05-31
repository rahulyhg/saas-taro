import { Request } from '../../../utils/request'

export default {
	namespace: 'newsIndex',
	state: {
		data: [],
		key: '72eed010c976e448971655b56fc2324e',
		v: '1.0'
	},

	effects: {
	},

	reducers: {
		updateState(state, { payload: data }) {
			return { ...state, ...data }
		}
	}

}