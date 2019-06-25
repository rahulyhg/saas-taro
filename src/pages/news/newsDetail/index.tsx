import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Image, Audio, Block, Button } from '@tarojs/components';
import { AtTextarea } from 'taro-ui';
import { connect } from '@tarojs/redux';
import DjLoading from '@/src/pages/common/djLoading';
import { IndexProps, IndexState } from './index.interface';
import { wxParse } from '../../../components/wxParse/wxParse';
import "./index.scss";
import "../../../components/wxParse/wxParse.scss";
import Dimage from '../../common/dimage';
import Nodata from '@/src/pages/common/nodata';

import { Request } from '@/src/utils/request';
const remoteImgPreUrl = process.env.remoteImgPreUrl;
const apiBackImgPre = process.env.apiBackImgPre;

@connect(({ newsDetail, portal }) => ({
	...newsDetail,
	dictionary: portal.dictionary
}))

class newsDetail extends Component<IndexProps, IndexState> {
	config: Config = {
		navigationBarTitleText: 'AI党建云'
	}
	constructor(props) {
		super(props)
		this.state = {
			isShowCommentTextarea: false,// 评论层的显示状态
			commentList: [],
			demo_icons_a: remoteImgPreUrl + "images/news/ns_zan.png",
			demo_icons_b: remoteImgPreUrl + "images/news/ns_zan_cur.png",
			addComt: remoteImgPreUrl + "images/news/addComt.png",
			playIconRed: remoteImgPreUrl + "images/news/playIconRed.png",
			playIconRed_play: remoteImgPreUrl + "images/news/playIconRed_play.png",

			audioIsPlay: false,// 音频文件 播放状态
			botMenu: [
				// { iconSrc: remoteImgPreUrl + "images/news/ns_comt.png" },
				{ iconSrc: remoteImgPreUrl + "images/news/ns_zan.png", iconSrcChecked: remoteImgPreUrl + "images/news/ns_zan_cur.png" },
				{ iconSrc: remoteImgPreUrl + "images/news/ns_start.png", iconSrcChecked: remoteImgPreUrl + "images/news/ns_start_cur.png" },
				{ iconSrc: remoteImgPreUrl + "images/news/ns_share.png" }
			],// 页脚 评论等icon

			my_comment_state: 0, // 开发者自定义的状态： 0 评论，1 回复评论，2 回复回复
			replyId: '', // 回复接口用
			replyCommentId: '', // 回复回复 接口用
			replyMsg: '',// 用户输入的评论内容
			placeholder: '评论文章',

			rtnData: {}, // 接口返回的详情数据
			isShowLoading: false, // 党建loading
		}
	}

	componentDidMount() {
		 // 视频开关
		 const isOpen = this.props.dictionary.mini_live_broadcast.name.isOpen;

		const params = this.$router.params;
		const _articleId = params.id;
		this.setState({
			articleId: _articleId,
			isOpen, // 视频相关
		})
		
		// 获取资讯详情接口
		this.findArticleDetail(_articleId);
		// 获取评论列表
		this.getCommonCommentList(_articleId);
		
	}

	// 获取文章详情
	findArticleDetail(_articleId) {
        const { dispatch } = this.props;
        const _objdata  = {
            articleId: _articleId
        };
        this.setState({
            isShowLoading: true
        });

		// 查询
		dispatch({
            type: 'newsDetail/findArticleDetail',
            payload: _objdata,
            callback: (res) => {
                
                if(res.code==1){
					let rtnData = res.data;
					let { botMenu } = this.state;
					// hasPraise (string, optional): 是否已经点赞 0 没有 1已点赞 ,
					// hasCollect (string, optional): 是否已经收藏 0 没有 1已收藏 ,
					// 判断 0赞 与 1收藏 状态 checked
					if (rtnData.hasPraise == 1) {
						botMenu[0].checked = true;
					}
					if (rtnData.hasCollect == 1) {
						botMenu[1].checked = true;
					}
					// 解析之前判断内容有么有
					const __content = rtnData.content || '<view style="text-align: center; font-size: 32px; color: 34px;">暂无内容</view>';
					// 解析
					wxParse('article', 'html', __content, this.$scope, 5);
                    // 写入页面
                    this.setState({
						rtnData,
						botMenu
                    }, ()=>{
						this.setState({
							isShowLoading: false
						});
                    });
                }else{
					this.setState({
						isShowLoading: false
					});
                    Taro.showModal({
                        title: '提示',
                        content: res.msg||'服务器开小差啦',
                        showCancel: false,
                    });
                }
               
            }
        });
	}

	// 点击切换
	checkAudio = ()=>{
		const audioIsPlay = !this.state.audioIsPlay;
		this.setState({ audioIsPlay });
	}
	
	// 点击页脚 评论、点赞、收藏、分享
	botMenuEvt = (index)=>{
		console.log("点击页脚=== 点赞、收藏、分享",index)
		if (index == 0) {
			const { botMenu } = this.state;
			if (botMenu[0].checked)	{
				// 取消点赞
				this.canclePraise(this.state.articleId, '1');
			} else {
				// 点赞
				this.savePraise(this.state.articleId, '1');
			}
		} else if (index == 1) {
			const { botMenu } = this.state;
			if (botMenu[1].checked)	{
				// 取消收藏
				this.cancelCollectArticle(this.state.articleId);
			} else {
				// 收藏
				this.collectArticle(this.state.articleId);
			}
		} 
		// 分享 用按钮实现，此处不做任何处理
	}

	// 点赞 文章
	savePraise(_businessId, _type) {
		const { dispatch } = this.props;
        const _objdata  = {
            businessId: _businessId,// 业务id (生态圈或者文章id或者评论id)
			type: _type,// 点赞类型 不传默认为生态圈，'1'：文章 '2'：评论
        };
        this.setState({
            isShowLoading: true
        });

		// 查询
		dispatch({
            type: 'newsDetail/savePraise',
            payload: _objdata,
            callback: (res) => {
                if(res.code==1){
					// 操作成功
					Taro.showToast({
						title: '操作成功',
						icon: 'success',
						duration: 2000
					});
					if (_type == '1') {
						// 文章点赞
						let { botMenu, rtnData } = this.state;
						// 判断 0赞 与 1收藏 状态 checked
						botMenu[0].checked = !botMenu[0].checked;
						rtnData.praiseCount = rtnData.praiseCount + 1;
						// 写入页面
						this.setState({
							botMenu,
							rtnData
						}, ()=>{
							this.setState({
								isShowLoading: false
							});
						});
					} else {
						// 评论点赞，更新评论列表数据
						this.getCommonCommentList(this.state.articleId);
					}
					
                }else{
					this.setState({
						isShowLoading: false
					});
                    Taro.showModal({
                        title: '提示',
                        content: res.msg||'服务器开小差啦',
                        showCancel: false,
                    });
                }
               
            }
        });
	}

	// 取消点赞 文章
	canclePraise(_businessId, _type) {
		const { dispatch } = this.props;
        const _objdata  = {
			businessId: _businessId,// 业务id (生态圈或者文章id或者评论id)
			type: _type,// 点赞类型 不传默认为生态圈，'1'：文章 '2'：评论
        };
        this.setState({
            isShowLoading: true
        });

		// 查询
		dispatch({
            type: 'newsDetail/canclePraise',
            payload: _objdata,
            callback: (res) => {
                if(res.code==1){
					// 操作成功
					Taro.showToast({
						title: '操作成功',
						icon: 'success',
						duration: 2000
					});
					if (_type == '1') {
						let { botMenu, rtnData } = this.state;
						// 判断 0赞 与 1收藏 状态 checked
						botMenu[0].checked = !botMenu[0].checked;
						rtnData.praiseCount = rtnData.praiseCount - 1;
						// 写入页面
						this.setState({
							botMenu
						}, ()=>{
							this.setState({
								isShowLoading: false
							});
						});
					} else {
						// 评论点赞，更新评论列表数据
						this.getCommonCommentList(this.state.articleId);
					}
					
                }else{
					this.setState({
						isShowLoading: false
					});
                    Taro.showModal({
                        title: '提示',
                        content: res.msg||'服务器开小差啦',
                        showCancel: false,
                    });
                }
               
            }
        });
	}

	// 收藏 文章
	collectArticle(_id) {
		const { dispatch } = this.props;
        const _objdata  = {
            id: _id,// 文章id
        };
        this.setState({
            isShowLoading: true
        });

		// 查询
		dispatch({
            type: 'newsDetail/collectArticle',
            payload: _objdata,
            callback: (res) => {
                if(res.code==1){
					// 操作成功
					Taro.showToast({
						title: '操作成功',
						icon: 'success',
						duration: 2000
					});
					let { botMenu } = this.state;
					// 判断 0赞 与 1收藏 状态 checked
					botMenu[1].checked = !botMenu[1].checked;
                    // 写入页面
                    this.setState({
						botMenu
                    }, ()=>{
                        this.setState({
							isShowLoading: false
						});
                    });
                }else{
					this.setState({
						isShowLoading: false
					});
                    Taro.showModal({
                        title: '提示',
                        content: res.msg||'服务器开小差啦',
                        showCancel: false,
                    });
                }
               
            }
        });
	}
	
	// 取消收藏 文章
	cancelCollectArticle(_id) {
		const { dispatch } = this.props;
        const _objdata  = {
            id: _id,// 文章id
        };
        this.setState({
            isShowLoading: true
        });

		// 查询
		dispatch({
            type: 'newsDetail/cancelCollectArticle',
            payload: _objdata,
            callback: (res) => {
                if(res.code==1){
					// 操作成功
					Taro.showToast({
						title: '操作成功',
						icon: 'success',
						duration: 2000
					});
					let { botMenu } = this.state;
					// 判断 0赞 与 1收藏 状态 checked
					botMenu[1].checked = !botMenu[1].checked;
                    // 写入页面
                    this.setState({
						botMenu
                    }, ()=>{
                        this.setState({
							isShowLoading: false
						});
                    });
                }else{
					this.setState({
						isShowLoading: false
					});
                    Taro.showModal({
                        title: '提示',
                        content: res.msg||'服务器开小差啦',
                        showCancel: false,
                    });
                }
               
            }
        });
	}

	// ****************************** 评论相关 开始 ************************
	// 获取评论列表
	getCommonCommentList(_articleId) {
		const { dispatch } = this.props;
        const _objdata  = {
            id: _articleId,// 业务id 文章id
			type: '1',// 评论类型 不传默认为生态圈，1：文章
        };
        this.setState({
            isShowLoading: true
        });

		// 查询
		dispatch({
            type: 'newsDetail/getCommonCommentList',
            payload: _objdata,
            callback: (res) => {
                if(res.code==1){
					const commentList = res.data;
                    // 写入页面
                    this.setState({
						commentList
                    }, ()=>{
                        this.setState({
							isShowLoading: false
						});
                    });
                }else{
					this.setState({
						isShowLoading: false
					});
                    Taro.showModal({
                        title: '提示',
                        content: res.msg||'服务器开小差啦',
                        showCancel: false,
                    });
                }
               
            }
        });
	}

	// 新增评论
	addComment(_businessId, _replyMsg) {
		const { dispatch } = this.props;
        const _objdata  = {
            businessId: _businessId,// 业务id (生态圈或者文章id) 
			replyMsg: _replyMsg,// 回复内容
			type: '1',// 评论类型 不传默认为生态圈，1：文章 
        };
        this.setState({
            isShowLoading: true
        });

		// 查询
		dispatch({
            type: 'newsDetail/addComment',
            payload: _objdata,
            callback: (res) => {
                if(res.code==1){
					// 操作成功
					Taro.showToast({
						title: '操作成功',
						icon: 'success',
						duration: 2000
					});
					// 更新 评论内容
					this.getCommonCommentList(this.state.articleId);
                }else{
					this.setState({
						isShowLoading: false
					});
                    Taro.showModal({
                        title: '提示',
                        content: res.msg||'服务器开小差啦',
                        showCancel: false,
                    });
                }
               
            }
        });
	}

	// 新增生态圈回复评论
	addReply(_replyId, _replyMsg){
		const { dispatch } = this.props;
        const _objdata  = {
            replyId: _replyId,// 评论id 
			replyMsg: _replyMsg,// 回复内容
			type: '1',// 评论类型 不传默认为生态圈，1：文章
        };
        this.setState({
            isShowLoading: true
        });

		// 查询
		dispatch({
            type: 'newsDetail/addReply',
            payload: _objdata,
            callback: (res) => {
                if(res.code==1){
					// 操作成功
					Taro.showToast({
						title: '操作成功',
						icon: 'success',
						duration: 2000
					});
					// 更新 评论内容
					this.getCommonCommentList(this.state.articleId);
                }else{
					this.setState({
						isShowLoading: false
					});
                    Taro.showModal({
                        title: '提示',
                        content: res.msg||'服务器开小差啦',
                        showCancel: false,
                    });
                }
               
            }
        });
	}

	// 新增回复评论:回复-回复
	replyComment(_replyCommentId, _replyMsg){
		const { dispatch } = this.props;
        const _objdata  = {
            replyCommentId: _replyCommentId,// 回复id 
			replyMsg: _replyMsg,// 回复内容 
			type: '1'// 评论类型 不传默认为生态圈，1：文章
        };
        this.setState({
            isShowLoading: true
        });

		// 查询
		dispatch({
            type: 'newsDetail/replyComment',
            payload: _objdata,
            callback: (res) => {
                if(res.code==1){
					// 操作成功
					Taro.showToast({
						title: '操作成功',
						icon: 'success',
						duration: 2000
					});
					// 更新 评论内容
					this.getCommonCommentList(this.state.articleId);
                }else{
					this.setState({
						isShowLoading: false
					});
                    Taro.showModal({
                        title: '提示',
                        content: res.msg||'服务器开小差啦',
                        showCancel: false,
                    });
                }
               
            }
        });
	}

	// 删除评论
	delComment(_id) {
		const { dispatch } = this.props;
        const _objdata  = {
            id: _id,// 评论/回复id
        };
        this.setState({
            isShowLoading: true
        });

		// 查询
		dispatch({
            type: 'newsDetail/delComment',
            payload: _objdata,
            callback: (res) => {
                if(res.code==1){
					// 操作成功
					Taro.showToast({
						title: '操作成功',
						icon: 'success',
						duration: 2000
					});
					// 更新 评论内容
					this.getCommonCommentList(this.state.articleId);
                }else{
					this.setState({
						isShowLoading: false
					});
                    Taro.showModal({
                        title: '提示',
                        content: res.msg||'服务器开小差啦',
                        showCancel: false,
                    });
                }
               
            }
        });
	}

	// 评论列表里的 点赞事件
	commentZanEvt = (replyId, hasPraise, e)=>{
		e.stopPropagation();// 阻止冒泡 
		console.log("评论列表里的 点赞事件",replyId, hasPraise)
		// hasPraise 0没有 1已点赞. 
		if (hasPraise == '0' || hasPraise == null) {
			this.savePraise(replyId, '2');
		} else if (hasPraise == '1'){
			this.canclePraise(replyId, '2');
		}
	}

	// 点击 准备 回复评论
	backToComment(_commentUserId, _replyId, _commentUserName) {
		
		// 获取用户id： sysUserId
		const userData = Request.getUserInfo();
		const my_sysUserId = userData.sysUserId;
		
		let _itemList = ['评论', '回复'];
		if (_commentUserId == my_sysUserId) {
			// 我自己，可以删除
			_itemList = ['评论', '回复', '删除'];
		}
		Taro.showActionSheet({
			itemList: _itemList,
			success: (res)=> {
				const _tapIndex = res.tapIndex;
				if (_tapIndex == 0) {
					// 状态 -- 评论
					this.setState({
						my_comment_state: 0,
						isShowCommentTextarea: true,
						placeholder: '评论文章',
					});
				} else if (_tapIndex == 1) {
					// 状态 -- 回复评论
					this.setState({
						my_comment_state: 1,
						isShowCommentTextarea: true,
						replyId: _replyId, // 回复接口用
						placeholder: '回复 ' + _commentUserName,
					});
				} else {
					this.setState({
						placeholder: '评论文章',
					});
					// 状态 -- 删除
					this.delComment(_replyId);
				}
			}
		});
	}
	
	// 点击 准备 回复回复
	backToBack(_commentUserId, _replyCommentId, _commentUserName) {
		
		// 获取用户id： sysUserId
		const userData = Request.getUserInfo();
		const my_sysUserId = userData.sysUserId;
		let _itemList = ['评论', '回复'];
		if (_commentUserId == my_sysUserId) {
			// 我自己，可以删除
			_itemList = ['评论', '回复', '删除'];
		}
		Taro.showActionSheet({
			itemList: _itemList,
			success: (res)=>{
				const _tapIndex = res.tapIndex;
				if (_tapIndex == 0) {
					// 状态 -- 评论
					this.setState({
						my_comment_state: 0,
						isShowCommentTextarea: true,
						placeholder: '评论文章',
					});
				} else if (_tapIndex == 1) {
					// 状态 -- 回复评论
					this.setState({
						my_comment_state: 2,
						isShowCommentTextarea: true,
						replyCommentId: _replyCommentId, // 回复回复 接口用
						placeholder: '回复 ' + _commentUserName,
					});
				} else {
					this.setState({
						placeholder: '评论文章',
					});
					// 状态 -- 删除
					this.delComment(_replyCommentId);
				}
			}
		});
	}

	// 点击 show出 新增评论 层
	addComtEvt = ()=>{
		this.setState({
            isShowCommentTextarea: true
        });
	}

	// 隐藏评论框
	hideCommentTextrea = ()=> {
        this.setState({
			isShowCommentTextarea: false
		});
	}
	
	// 评论框 change事件
	handleChange = (e)=> {
		const replyMsg = e.detail.value;
		this.setState({ replyMsg });
	}
	
	// 点击发送评论
	sendMsg = ()=>{
		this.setState({
			isShowCommentTextarea: false
		});
		// replyId: '', // 回复接口用
		// replyCommentId: '', // 回复回复 接口用
		const { articleId, replyMsg, my_comment_state, replyId, replyCommentId } = this.state;
		// my_comment_state 0 评论，1 回复评论，2 回复回复
		if (my_comment_state == 0) {
			// 评论
			this.addComment(articleId, replyMsg);
		} else if (my_comment_state == 1) {
			// 回复评论
			this.addReply(replyId, replyMsg);
		} else if (my_comment_state == 2) {
			// 回复回复
			this.replyComment(replyCommentId, replyMsg);
		}
		
	}
	// ****************************** 评论相关 结束 ************************

	// 页面分享事件
    onShareAppMessage() {
		const { rtnData } = this.state;
		const _imageUrl = process.env.remoteImgPreUrl + (rtnData.cover || 'images/common/shareDefaultImg.png');
		const _redirect = encodeURIComponent('/pages/news/newsDetail/index?id=' + this.state.articleId);
        return {
            title: rtnData.title,
            path: '/pages/portal/index?redirect=' + _redirect,
            imageUrl: _imageUrl
        }
    }
  
	render() {
		const { rtnData, playIconRed, audioIsPlay, isShowCommentTextarea, replyMsg, 
			playIconRed_play, addComt, botMenu, placeholder, isOpen } = this.state;
		return (
			<View className='newsDetail'>
				
				{/* 视频--微信原生 - 支持支付宝小程序 */}
				{
					(rtnData.isVideo == 1 && isOpen == 1) ? 
					<Block>
						<View className='videoCom'>
							<video
								id="myVideo"
								src={apiBackImgPre + rtnData.videoList[0].path}
								enable-danmu
								danmu-btn
								controls
							></video>
						</View>
						<View className="videoSpace"></View>
					</Block> : null
				}

				{/* 标题 */}
				{
					(rtnData.title || rtnData.siteName) ?
					<Block>
						<View className="newsTitle">{rtnData.title}</View>
						<View className="timeAndSubtit">
							<Text className="org">{rtnData.siteName}</Text>
							<Text className="gray marLR20">{rtnData.visitCount} 阅读</Text>
							<Text className="gray">{rtnData.releaseDate[0] + '-' + rtnData.releaseDate[1] + '-' + rtnData.releaseDate[2]}</Text>
						</View>
					</Block> : null
				}

				{/* 音频 */}
				{
					(rtnData.isAudio == 1 && isOpen == 1 ) ? 
					<View className="audioCom">
						<View className="myAudio flex contentStart">
							<Image className="audioImg" src={audioIsPlay ? playIconRed_play : playIconRed} mode="aspectFill"/>
							<View>
								<View className="myAudioName ellTwoLine">{rtnData.audioList[0].userName}</View>
								<View className="size24 gray">
									<Text>{rtnData.audioList[0].name}</Text>  
									<Text className="marL30">{(rtnData.audioList[0].size/1024/1024).toFixed(1)}M</Text>
								</View>
							</View>
						</View>
						<Audio
							className="taroAudio"
							src={apiBackImgPre + rtnData.audioList[0].path}
							controls={true}
							autoplay={false}
							loop={false}
							muted={true}
							id='video'
							onClick={this.checkAudio.bind(this)}
							/>
					</View> : null
				}
				
				{
					// 富文本解析器 渲染 判断  weapp  alipay
					process.env.TARO_ENV === 'weapp' ? 
					<View>
						<import src='../../../components/wxParse/wxParse.wxml'/>
						<template is='wxParse' data='{{wxParseData:article.nodes}}'/>
					</View> : 
					<View>
						<import src='../../../components/wxParse/wxParse.axml'/>
						<template is='wxParse' data='{{wxParseData:article.nodes}}'/>
					</View>
				}

				{/* 评论 列表 */}
				<View>
					<View className="commentTit size36">用户评论</View>
					{
						(this.state.commentList && this.state.commentList.length > 0) ? 
						this.state.commentList.map((item,index)=>{
							return (
								<View className="flex itemStart lists" key={`comt ${index}`} onClick={this.backToComment.bind(this, item.commentUserId, item.id, item.commentUserName)}>
									<Dimage
										type='avatar'
										styleValue='width: 80rpx; height: 80rpx; border-radius: 50%; margin-top: 10rpx;'
										src={ process.env.apiBackImgPre + item.commentUserAvatar }
										mode="aspectFill" / >
									<View className="rightView">
										<View className="flex size28">
											<Text>{item.commentUserName}</Text>
											<View className="active" onClick={this.commentZanEvt.bind(this, item.id, item.hasPraise)}>
												<Text className={`size24 ${item.hasPraise == '1' ? "red" : "gray"}`}>{item.praiseCount}</Text>
												<Image className="ns_icons" 
													src={item.hasPraise == '1' ? this.state.demo_icons_b : this.state.demo_icons_a} mode="aspectFill"/>
											</View>
										</View>
										<View className="content">{item.replyMsg}</View>
										<View className="gray size24">{item.commentTime}</View>
										{
											item.sonList ? 
											<View className="backList">
												{
													item.sonList.map((c_item, c_index)=>{
														return (
															<View className="marT10" key={`backList ${c_index}`} onClick={(e)=>{
																	e.stopPropagation();// 阻止冒泡 回复回复
																	return this.backToBack(c_item.commentUserId, c_item.id, c_item.commentUserName);
																}}>
																<Text className="lessOrg marR20">{c_item.commentUserName}</Text>回复
																<Text className="lessOrg marL20 marR20">{c_item.sysUserName}</Text>{c_item.replyMsg}
															</View>
														)
													})
												}
											</View> : null
										}
									</View>
									
								</View>
							)
						}) :
						<Nodata show={true} stylevalue='margin-top: -50px;' notice='暂无评论数据' />
					}
					<View>
						
					</View>
				</View>
				
				{/* 底部 menu */}
				
				<View className="botMenu flex">
					<View className="flex contentStart active gray size30 botMenuInputCom" onClick={(e)=>{
							e.stopPropagation();// 阻止冒泡
							return this.addComtEvt();
						}}>
						<Image className="menuIcons" src={addComt} mode="aspectFill"/>
						写评论
					</View>
					<View className="flex contentEnd posrel">
						{
							botMenu.map((_item,_index)=>{
								return (
									<View className="botBlock flex contentCenter active" key={`botMenu ${_index}`} onClick={(e)=>{
											e.stopPropagation();// 阻止冒泡
											return this.botMenuEvt(_index);
										}} key={`botMenu ${_index}`}>
										<Image className="menuIcons" src={ _item.checked ? _item.iconSrcChecked : _item.iconSrc} mode="aspectFill"/>
										{
											_index == 0 ? <View className='redPoint'>{rtnData.praiseCount}</View> : ''
										}
										
									</View>
								)
							})
						}
						<Button open-type='share' className='shareBtn' />
					</View>
				</View>
				
				
				{/* 评论 输入框层 */}
				{
					isShowCommentTextarea ?
					<View className="textareaCom">
						<View className="grayCover" onClick={this.hideCommentTextrea}></View>
						<View className="commentView">
							<AtTextarea
								className="atTextarea"
								count={false}
								height={160}
								value=''
								onChange={this.handleChange.bind(this)}
								maxLength={200}
								onConfirm={this.sendMsg.bind(this)}
								placeholder={placeholder}
							/>
							<View className="flex padLR30">
								<Text className="gray size30">
									{replyMsg.length} /200
								</Text>
								<View className="gray size30 active" onClick={this.sendMsg.bind(this)}>
									发送
								</View>
							</View>
						</View>
					</View> : null

                }
				{/* djLoading */}
                <DjLoading isshow={this.state.isShowLoading} />
				<View style='height: 100rpx;'></View>
			</View>
		)
	}
}

export default newsDetail