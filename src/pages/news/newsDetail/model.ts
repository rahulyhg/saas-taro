import { findArticleDetail, collectArticle, cancelCollectArticle } from '@/src/service/newsService';
// 评论相关 
import { getCommonCommentList, replyComment, addReply, addComment, delComment } from '@/src/service/commentService';
// 点赞、取消点赞、转发
import { savePraise, canclePraise } from '@/src/service/praiseService';

export default {
	namespace: 'newsDetail',
	state: {

	},

	effects: {
		// 获取文章详情
		*findArticleDetail({ payload, callback }, { call }) {
			const response = yield call(findArticleDetail, payload);
			if (!response) {
				return;
			}
			if (callback) {
				callback(response);
			}
		},

		// 收藏文章
		*collectArticle({ payload, callback }, { call }) {
			const response = yield call(collectArticle, payload);
			if (!response) {
				return;
			}
			if (callback) {
				callback(response);
			}
		},

		// 取消收藏文章
		*cancelCollectArticle({ payload, callback }, { call }) {
			const response = yield call(cancelCollectArticle, payload);
			if (!response) {
				return;
			}
			if (callback) {
				callback(response);
			}
		},

		// ************************评论相关 开始******************************
		// 获取评论列表
		*getCommonCommentList({ payload, callback }, { call }) {
			const response = yield call(getCommonCommentList, payload);
			if (!response) {
				return;
			}
			if (callback) {
				callback(response);
			}
		},
		
		// 新增生态圈评论
		*addComment({ payload, callback }, { call }) {
			const response = yield call(addComment, payload);
			if (!response) {
				return;
			}
			if (callback) {
				callback(response);
			}
		},

		// 新增生态圈回复评论
		*addReply({ payload, callback }, { call }) {
			const response = yield call(addReply, payload);
			if (!response) {
				return;
			}
			if (callback) {
				callback(response);
			}
		},

		// 新增回复评论:回复-回复
		*replyComment({ payload, callback }, { call }) {
			const response = yield call(replyComment, payload);
			if (!response) {
				return;
			}
			if (callback) {
				callback(response);
			}
		},

		// 删除生态圈评论
		*delComment({ payload, callback }, { call }) {
			const response = yield call(delComment, payload);
			if (!response) {
				return;
			}
			if (callback) {
				callback(response);
			}
		},
		// ************************评论相关 结束******************************
		
		// 点赞
		*savePraise({ payload, callback }, { call }) {
			const response = yield call(savePraise, payload);
			if (!response) {
				return;
			}
			if (callback) {
				callback(response);
			}
		},

		// 取消点赞
		*canclePraise({ payload, callback }, { call }) {
			const response = yield call(canclePraise, payload);
			if (!response) {
				return;
			}
			if (callback) {
				callback(response);
			}
		},



	},

	reducers: {
		updateState(state, { payload: data }) {
			return { ...state, ...data }
		}
	}

}