import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Image, Audio, Block } from '@tarojs/components';
import { AtTextarea } from 'taro-ui';
import { connect } from '@tarojs/redux';
// import Api from '../../utils/request';
// import Tips from '../../utils/tips';
import { IndexProps, IndexState } from './index.interface';
import { wxParse } from '../../../components/wxParse/wxParse';
import "./index.scss";
import "../../../components/wxParse/wxParse.scss";
const remoteImgPreUrl = process.env.remoteImgPreUrl;

@connect(({ newsDetail }) => ({
	...newsDetail,
}))

class newsDetail extends Component<IndexProps, IndexState> {
	config: Config = {
		navigationBarTitleText: 'AI党建云'
	}
	constructor(props) {
		super(props)
		this.state = {
			isShowCommentTextarea: false,// 评论层的显示状态
			commentList: [
				{
					iszan: true,
					backList: [
						{},{}
					]
				},{
					iszan: false,
					backList: [
						{},{}
					]
				}
			],
			demoImg: "https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64",
			demo_icons_a: remoteImgPreUrl + "images/news/ns_zan.png",
			demo_icons_b: remoteImgPreUrl + "images/news/ns_zan_cur.png",
			videoSrc: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=3028020101'+
			'0421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid'+
			'=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8'+
			'd7f02030f42400204045a320a0201000400',
			audioSrc:'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82de'+
			'f4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7'+
			'C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF7'+
			'4C0A5CCFADD6471160CAF3E6A&fromtag=46',
			playIconRed: remoteImgPreUrl + "images/news/playIconRed.png",
			playIconRed_play: remoteImgPreUrl + "images/news/playIconRed_play.png",
			audioIsPlay: false,// 音频文件 播放状态
			addComt: remoteImgPreUrl + "images/news/addComt.png",
			botMenu: [
				{iconSrc: remoteImgPreUrl + "images/news/ns_comt.png"},
				{iconSrc: remoteImgPreUrl + "images/news/ns_zan.png"},
				{iconSrc: remoteImgPreUrl + "images/news/ns_start.png"},
				{iconSrc: remoteImgPreUrl + "images/news/ns_share.png"}
			],// 页脚 评论等icon
			commentText: '',// 用户输入的评论内容
		}
	}

	// 获取今日数据
	async getData(month, day) {
		await this.props.dispatch({
			type: 'index/getLists',
			payload: {
				month: month,
				day: day
			}
		})
	}


	componentDidMount() {
		
		const article = '<div style="color: green;">我是HTML代码我是HTML代码我是HTML代码我是HTML代码我是HTML代码我是HTML代码</div>'
		wxParse('article', 'html', article, this.$scope, 5);
	}

	// 点赞事件
	zanEvt = ()=>{
		console.log("****点赞事件****")
	}

	// 点击切换
	checkAudio = ()=>{
		const audioIsPlay = !this.state.audioIsPlay;
		this.setState({ audioIsPlay });
	}

	// 点击新增评论
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
		const commentText = e.detail.value;
		this.setState({ commentText });
	}
	
	// 点击发送评论
	sendMsg = ()=>{
		this.setState({
			isShowCommentTextarea: false
		});
	}

	// 点击页脚 评论、点赞、收藏、分享
	botMenuEvt = (index)=>{
		console.log("点击页脚===评论、点赞、收藏、分享",index)
	}
	
  
	render() {
		const {videoSrc, audioSrc, playIconRed, audioIsPlay, isShowCommentTextarea, commentText, 
			playIconRed_play, addComt, botMenu} = this.state;
		return (
			<View className='newsDetail'>
				
				{/* 视频--微信原生 - 支持支付宝小程序 */}
				{
					videoSrc?
					<Block>
						<View className='videoCom'>
							<video
								id="myVideo"
								src={videoSrc}
								danmu-list="{{danmuList}}"
								enable-danmu
								danmu-btn
								controls
							></video>
						</View>
						<View className="videoSpace"></View>
					</Block> : null
				}
				
				{/* 标题 */}
				<View className="newsTitle">我是新闻标题我是新闻我是新闻标题我是新闻标题</View>
				<View className="timeAndSubtit">
					<Text className="org">AI党建云支部</Text>
					<Text className="gray">2019-04-17</Text>
				</View>

				{/* 音频 */}
				<View className="audioCom">
					<View className="myAudio flex">
						<Image className="audioImg" src={audioIsPlay ? playIconRed_play : playIconRed} mode="aspectFill"/>
						<View>
							<View className="myAudioName ellTwoLine">我是音频名称名称</View>
							<View className="size24 gray"><Text>03:00</Text>  <Text className="marL30">5M</Text></View>
						</View>
					</View>
					<Audio
						className="taroAudio"
						src={audioSrc}
						controls={true}
						autoplay={false}
						loop={false}
						muted={true}
						id='video'
						onClick={this.checkAudio.bind(this)}
						/>
					
				</View>
				
				
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
						this.state.commentList.map((item,index)=>{
							return (
								<View className="flex itemStart lists" key={`comt ${index}`}>
									<Image className="head_s" src={this.state.demoImg} mode="aspectFill"/>
									<View className="rightView">
										<View className="flex size28">
											<Text>高淑珍</Text>
											<View className="active" onClick={this.zanEvt.bind(this)}>
												<Text className={`size24 ${item.iszan?"red":"gray"}`}>12</Text>
												<Image className="ns_icons" src={item.iszan?this.state.demo_icons_b:this.state.demo_icons_a} mode="aspectFill"/>
											</View>
										</View>
										<View className="content">Ant Design是一个服务于企业级产品的设计体系，
											基于『确定』和『自然』的设计价值观和模块化的解决方案，
											让设计者专注于更好的用户体验。</View>
										<View className="gray size24">2019-5-5 15:25</View>
										<View className="backList">
											{
												item.backList.map((c_item, c_index)=>{
													return (
														<View className="marT10" key={`backList ${c_index}`}>
															<Text className="lessOrg marR20">张芳</Text>回复
															<Text className="lessOrg marL20 marR20">张芳</Text>我很喜欢你的作品，设计价值观和模块化的解决方案。
														</View>
													)
												})
												
											}
										</View>
										
									</View>
								</View>
							)
						})
					}
					<View>
						
					</View>
				</View>
				{/* 底部 menu */}
				
				<View className="botMenu flex">
					<View className="flex contentStart active gray size30" onClick={(e)=>{
							e.stopPropagation();// 阻止冒泡
							return this.addComtEvt();
						}}>
						<Image className="menuIcons" src={addComt} mode="aspectFill"/>
						写评论
					</View>
					<View className="flex contentEnd">
						{
							botMenu.map((_item,_index)=>{
								return (
									<View className="botBlock flex contentCenter active" onClick={(e)=>{
											e.stopPropagation();// 阻止冒泡
											return this.botMenuEvt(_index);
										}} key={`botMenu ${_index}`}>
										<Image className="menuIcons" src={_item.iconSrc} mode="aspectFill"/>
									</View>
								)
							})
						}
					</View>
				</View>
				{/* 评论层 */}
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
								placeholder='你的问题是...'
							/>
							<View className="flex padLR30">
								<Text className="gray size30">
									{commentText.length} /200
								</Text>
								<View className="gray size30 active" onClick={this.sendMsg.bind(this)}>
									发送
								</View>
							</View>
						</View>
					</View> : null

                }


			</View>
		)
	}
}

export default newsDetail