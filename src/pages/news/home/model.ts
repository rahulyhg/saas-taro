import { findArticleList, findHomeSite, findColumnList, 
	findSlideArticle, findBranchSite } from '@/src/service/newsService';

export default {
	namespace: 'news',
	state: {
		
	},

	effects: {
		// 查找文章列表
		*findArticleList({ payload, callback }, { call }){
			const response = yield call(findArticleList, payload);
			if (!response) {
				return;
			}
			if (callback) {
				callback(response);
			}
		},
		// 获取用户的最大站点和可选的党委列表
		*findHomeSite({ payload, callback }, { call }){
			const response = yield call(findHomeSite, payload);
			if (!response) {
				return;
			}
			if (callback) {
				callback(response);
			}
		},
		// 根据党委站点的id查找栏目列表
		*findColumnList({ payload, callback }, { call }){
			const response = yield call(findColumnList, payload);
			if (!response) {
				return;
			}
			if (callback) {
				callback(response);
			}
		},
		// 查找幻灯的文章
		*findSlideArticle({ payload, callback }, { call }){
			const response = yield call(findSlideArticle, payload);
			if (!response) {
				return;
			}
			if (callback) {
				callback(response);
			}
		},
		// 根据党委站点的id查找可选支部列表，以及默认支部
		*findBranchSite({ payload, callback }, { call }){
			const response = yield call(findBranchSite, payload);
			if (!response) {
				return;
			}
			if (callback) {
				callback(response);
			}
		},
	},

	reducers: {
		updateState(state, { payload }) {
			return { ...state, ...payload }
		}
	}

}