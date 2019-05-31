
import Taro, { Component, Config } from '@tarojs/taro'
import { ImeetUserDetailProps, ImeetUserDetailState } from './index.interface'
import { View, Text, Image, Block, Button, CoverView, Video, LivePlayer } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Dimage from '../../../../pages/common/dimage'
import { getDistance } from '../../../../utils/common'
const remoteImgPreUrl = process.env.remoteImgPreUrl;
// 图片资源
const addrGray = remoteImgPreUrl + 'images/subPackageWork/addrGray.png';
const addrRed = remoteImgPreUrl + 'images/subPackageWork/addrRed.png';
const atPersons = remoteImgPreUrl + 'images/subPackageWork/atPersons.png';
const atChart = remoteImgPreUrl + 'images/subPackageWork/atChart.png';
const atSpeaker = remoteImgPreUrl + 'images/subPackageWork/atSpeaker.png';
const atHost = remoteImgPreUrl + 'images/subPackageWork/atHost.png';
const time = remoteImgPreUrl + 'images/subPackageWork/time.png';
const org = remoteImgPreUrl + 'images/subPackageWork/org.png';
const arrR = remoteImgPreUrl + 'images/subPackageWork/arrR.png';
const imgIcon = remoteImgPreUrl + 'images/subPackageWork/imgIcon.png';
const annex = remoteImgPreUrl + 'images/subPackageWork/annex.png';

import './index.scss'
import '../../../style/meet.scss'

@connect(({meetUserDetail}) => ({
  	...meetUserDetail,
}))

class Index extends Component<ImeetUserDetailProps,ImeetUserDetailState > {
	config: Config = {
		navigationBarTitleText: '会议详情'
	}
	constructor(props: ImeetUserDetailProps) {
		super(props)
		this.state = {
			meetDetail: {},// 返回的详情
			backPlayersArr: [],// 回放资源数组
			meetPullUrl: '', // 直播拉流 地址
			meetPushUrl: '', // 直播推流 地址
		}
	}

	componentDidMount() {
		const params = this.$router.params;// 页面参数
		this.setState({
			meetId: params.id,// 会议id，放在state里供其他接口使用
		});
		this.findMeetDetailById(params.id);// 获取详情 接口
		this.getPullUrlByMeetId(params.id);// 个人访问返回直播状态和播流地址 接口
		this.getRecordUrl(params.id); // 获取 回放资源 mp4 串
	}

	
	// 点击 参与组织
	handleChooseOrg() {
		// joinOrgList 发布时选择的组织列表. ,
		Taro.navigateTo({
			url: '/subPackageWork/pages/meeting/meetOrgAndUserList/index?listType='+'org' 
			+ '&listData=' + JSON.stringify(this.state.meetDetail.joinOrgList)
		})
	}
	
	// 点击 参与人员
	handleChooseUser() {
		// joinUserList 发布时选择的人员列表. ,
		Taro.navigateTo({
			url: '/subPackageWork/pages/meeting/meetOrgAndUserList/index?listType='+'user'
			+ '&listData=' + JSON.stringify(this.state.meetDetail.joinUserList)
		})
	}

	// 获取会议详情 接口
	findMeetDetailById(_id){
		const { dispatch } = this.props;
		Taro.showLoading({
            mask: true,
            title: '加载中'
        });
        const _objdata  = { 
			id: _id
		};
		// 新增
		dispatch({
            type: 'meetUserDetail/findMeetDetailById',
            payload: _objdata,
            callback: (res) => {
                Taro.hideLoading();
                if(res.code==1){
					let meetDetail = res.data;
					// 过滤 参会人员列表 和 未参会人员列表
					let attendUserList:any = []; // 实际出席人员list
					let absentUserList:any = []; // 实际缺席人员list
					let my_sysUserId = Taro.getStorageSync(process.env.tokenKey).sysUserId;
					meetDetail.relJoinUserList.map((item)=>{
						if (item.signState==1) {
							attendUserList.push(item);
						}else{
							absentUserList.push(item);
						}
						// 判断用户本人是否签到 meetDetail.signState
						if(item.sysUserId == my_sysUserId){
							meetDetail.signState = item.signState;
						}
					});
					meetDetail.attendUserList = attendUserList;
					meetDetail.absentUserList = absentUserList;
					this.setState({
						meetDetail,
					});
                }else{
                    Taro.showModal({
                        title: '提示',
                        content: res.msg||'服务器开小差啦',
                        showCancel: false,
                    }).then(res => console.log(res.confirm, res.cancel));
                }
            }
        });
		
	}

	// 个人访问返回直播状态和播流地址
	getPullUrlByMeetId(_meetId){
		const { dispatch } = this.props;
		Taro.showLoading({
            mask: true,
            title: '加载中'
        });
        const _objdata  = { 
			meetId: _meetId
		};
		// 新增
		dispatch({
            type: 'meetUserDetail/getPullUrlByMeetId',
            payload: _objdata,
            callback: (res) => {
                Taro.hideLoading();
                if(res.code==1){
					// meetPullUrl (string, optional): 推流地址. ,
					// meetPushUrl (string, optional): 播流地址. ,
					this.setState({
						meetPullUrl: res.data.meetPullUrl,
						meetPushUrl: res.data.meetPushUrl,
					});
                }else{
                    Taro.showModal({
                        title: '提示',
                        content: res.msg||'服务器开小差啦',
                        showCancel: false,
                    });
                }
            }
        });
	}

	// 点击视频 // videoState: 会议直播的状态（ 0未开始直播 1正在直播 2结束直播）

	// 获取 回放资源 mp4 串
	getRecordUrl(_meetId){
		const { dispatch } = this.props;
		Taro.showLoading({
            mask: true,
            title: '加载中'
        });
        const _objdata  = { 
			meetId: _meetId
		};
		// 新增
		dispatch({
            type: 'meetUserDetail/getRecordUrl',
            payload: _objdata,
            callback: (res) => {
                Taro.hideLoading();
                if(res.code==1){
					// 返回的 回放资源 mp4 串 例：“url1.mp4,url2.mp4,url2.mp4,url2.mp4”
					let _backPlayersStr = res.data;
					const backPlayersArr = _backPlayersStr.split(',');
					this.setState({
						backPlayersArr 
					});
                }else{
                    Taro.showModal({
                        title: '提示',
                        content: res.msg||'服务器开小差啦',
                        showCancel: false,
                    }).then(res => console.log(res.confirm, res.cancel));
                }
            }
        });
	}

	// 点击签到事件 getDistance
	doSign(){
		const { meetDetail } = this.state; // meetingModality 会议形式：0线下会议 1视频会议
		// 1.视频会议?
			// 是===》直播状态 ===》拉流 / 回放记录
			// 否===》2.是否开启签到？
					//  否 ===》不显示签到按钮
					//  是 ===》3.是否签到？
								// 是 ===》显示已签到按钮
								// 否 ===》4.是否经纬度签到？
										// 是 ===》1000 米以外，提示一下距离太远，但不做任何影响
										// 否 ===》5.是否扫码进入？
												// 是 ===》页面有一个参数  timeStamp 时间戳参数，10分钟之外不可以签到
												// 否 ===》直接签到

		if (meetDetail.meetingModality == 1) {
			// 视频会议 == 直播状态 ===》拉流（跳转到新页面看直播） / 回放记录（当前页面直接播放）
			// videoState: 会议直播的状态（ 0未开始直播 1正在直播 2结束直播）
			
		}
	}

	// 点击签到接口
	doSignFun(){
		let { meetDetail } = this.state;
		const { dispatch } = this.props;
		Taro.showLoading({
            mask: true,
            title: '加载中'
        });
        const _objdata  = { 
			latitude: meetDetail.latitude,// (number, optional): 签到地址纬度 ,
			longitude: meetDetail.longitude,// (number, optional): 签到地址经度 ,
			meetingId: this.state.meetId,// (string, optional): 会议表id ,
			// absentReason: ,// (string, optional): 缺席原因. ,
			// avatar: ,// (string, optional): 头像 ,
			// id: ,// (string, optional): 主键 ,
			// name: ,// (string, optional): 用户名 ,
			// rangeNote: ,// (string, optional): 超出范围简要说明 ,
			// signState: 1,// (string, optional): 签到状态：0未签到 1已签到. ,
			// signTime: ,// (LocalDateTime, optional): 签到时间 ,
			// sysUserId: ,// (string, optional): 用户表id ,
			// watchTime: ,// (string, optional): 观看时长 单位分钟
		};
		// 新增
		dispatch({
            type: 'meetUserDetail/doSign',
            payload: _objdata,
            callback: (res) => {
                Taro.hideLoading();
                if(res.code==1){
					// 签到成功
					Taro.showToast({
                        title: '操作成功',
                        icon: 'success',
                        duration: 2000
					});
					const keyName:string =  'meetDetail.signState';
					this.setState({
						[keyName]: 1
					});
                }else{
                    Taro.showModal({
                        title: '提示',
                        content: res.msg||'服务器开小差啦',
                        showCancel: false,
                    }).then(res => console.log(res.confirm, res.cancel));
                }
            }
        });
	}

	// 跳出去看附件详情
	skipToFileDetail(index){
		console.log(index)
	}

	// 预览图片附件
	previewImages(){
		const imgFileList = this.state.imgFileList;
		let _imgFileList:any = [];
		imgFileList.map((item)=>{
			_imgFileList.push(item.path);
		});
		Taro.previewImage({
			current: _imgFileList[0], // 当前显示图片的http链接
			urls: _imgFileList, // 需要预览的图片http链接列表
		});
	}

	// onStateChange

	render() {
		// videoState : 会议直播的状态:  0未开始直播 1正在直播 2结束直播  
		const{ meetDetail, backPlayersArr, meetPullUrl } = this.state;
		return (
			<View className='meetUserDetail-wrap meetDetail'>
				{

					meetDetail.videoState == 0 ? 
						<View className='videoCom'>
							<Video
								id="myVideo"
								src={backPlayersArr[0]}
								enable-danmu
								danmu-btn
								controls
							/>
						</View> : 
						meetDetail.videoState == 1 ?
						<View className='videoCom'>
							<LivePlayer
								id='liveplayer' 
								src={meetPullUrl} 
								autoplay={true} 
								onStateChange={this.onStateChange.bind(this)} 
								onError='onError'>
								<CoverView className='videoCover'>正在直播</CoverView>
							</LivePlayer>
						</View> : 
						<View className='videoCom'>
							<Video
								id="myVideo"
								src=''
								enable-danmu
								danmu-btn
								controls>
								<CoverView className='videoCover'>直播暂未开始</CoverView>
							</Video>
						</View>
						
				}
				{/* 标题 */}
				<View className='mtTitle'>{meetDetail.name }</View>
				<View className='flex subTit'>
					<Text>{meetDetail.typeName}</Text>
					<Text>{meetDetail.orgName}</Text>
				</View>
				<View className='flex mtList'>
					<View className='flex contentStart'>
						<Image className='mtIcons marR20' mode='aspectFill' src={addrGray}/>
						<View className='label addrTxt'>{meetDetail.mapAddress}{meetDetail.meetingAddress}</View>
					</View>
					<Image className='mtIcons' mode='aspectFill' src={addrRed}/>
				</View>
				<View className='flex mtList'>
					<View className='flex contentStart'>
						<Image className='mtIcons marR20' mode='aspectFill' src={time}/>
						<View className='label addrTxt'>{meetDetail.startTime}</View>
					</View>
					{/* 全部显示手输的时长 */}
					<View className='gray size28'>时长{meetDetail.meetingDuration}分钟</View>
				</View>

				{/* 参与组织 */}
				<View className='flex mtList' onClick={this.handleChooseOrg.bind(this)}>
					<View className='flex contentStart'>
						<Image className='mtIcons marR20' mode='aspectFill' src={org}/>
						<View className='label'>参与组织</View>
					</View>
					<View className='flex contentEnd'>
						<View className='gray size28'>{meetDetail.joinOrgList.length}个组织</View>
						<Image className='arrR' mode='aspectFill' src={arrR}/>
					</View>
				</View>
				{/* 已结束？参会情况：参会人员 */}
				{
					meetDetail.state == 2 ?
					<View className='flex mtList'>
						<View className='flex contentStart'>
							<Image className='mtIcons marR20' mode='aspectFill' src={atChart}/>
							<View className='label'>参会情况</View>
						</View>
						<View className='gray size28'>
							应参会{meetDetail.shouldNum ? meetDetail.shouldNum : meetDetail.relJoinUserList.length}人 
							实到{meetDetail.actualNum ? meetDetail.actualNum : meetDetail.attendUserList.length} 
							缺席{(meetDetail.shouldNum ? meetDetail.shouldNum : meetDetail.relJoinUserList.length) - meetDetail.actualNum}人
						</View>
					</View> : 
					<View className='flex mtList' onClick={this.handleChooseUser.bind(this)}>
						<View className='flex contentStart'>
							<Image className='mtIcons marR20' mode='aspectFill' src={atPersons}/>
							<View className='label'>参与人员</View>
						</View>
						<View className='flex contentEnd'>
							{
								meetDetail.joinUserList.map((hd_item, hd_index)=>{
									return(
										hd_index > 2 ? null : 
										<Dimage 
											key={`hd_${hd_index}`} 
											type='avatar'
											src={hd_item.avatar} 
											mode='aspectFill' 
											styleValue='width: 52rpx; height: 52rpx;border-radius: 50%;margin-right: 6px;'
											/>
									)
								})
							}
							
							<View className='gray size28'>
								{meetDetail.joinUserList.length>2?'等':''}{meetDetail.joinUserList.length}人
							</View>
							<Image className='arrR' mode='aspectFill' src={arrR}/>
						</View>
					</View>
				}
				

				{/* 会议主持、会议主讲*/}
				{
					meetDetail.state == 2 ?
					<Block>
						<View className='flex mtList'>
							<View className='flex contentStart'>
								<Image className='mtIcons marR20' mode='aspectFill' src={atHost}/>
								<View className='label'>会议主持</View>
							</View>
							<View className='gray size28'>{meetDetail.meetingCompere}</View>
						</View>
						<View className='flex mtList'>
							<View className='flex contentStart'>
								<Image className='mtIcons marR20' mode='aspectFill' src={atSpeaker}/>
								<View className='label'>会议主讲</View>
							</View>
							<View className='gray size28'>{meetDetail.meetingSpeaker}</View>
						</View>
					</Block> : null
				}
				
				<View className='graySpace'></View>

				{/* 会议介绍、会议纪要、 */}
				<View className='mtIntroduce'>会议{meetDetail.state == 2 ? '纪要' : '介绍'}</View>
				<View className='mtIntroText'>
					{meetDetail.content}
				</View>

				{/* 附件 */}
				{
					meetDetail.imgFileList.length > 0 ? 
					<View className='annexCom active' onClick={this.previewImages.bind(this)}>
						<Dimage 
							type='avatar'
							src={imgIcon} 
							mode='aspectFit' 
							styleValue='width: 28rpx; height: 28rpx;margin-right: 10px;'
							/>
						<Text className='size28'>图片{meetDetail.imgFileList.length}张</Text>
					</View> : null
				}
				{
					meetDetail.fileList.map((fl_item, fl_index)=>{
						return(
							<View className='annexCom active' key={`annex${fl_index}`} onClick={this.skipToFileDetail.bind(this,fl_index)}>
								<Dimage 
									type='avatar'
									src={annex} 
									mode='aspectFit' 
									styleValue='width: 28rpx; height: 28rpx;margin-right: 10px;'
									/>
								<Text className='size28'>{fl_item.name}</Text>
							</View>
						)
					})
				}
				
				{/* 按钮 
					state  会议进度（状态） 0：未开始1：未结束2：已结束. ,
					startSignState  签到状态 0:暂未签到 1：开始签到. ,
				*/}
				<View className='next-btn'>
					{
						meetDetail.startSignState == 1 && meetDetail.signState == 0 ? 
						<Button type='primary' className='active' onClick={this.doSign.bind(this)}>签到</Button>
						: null
					}
					{
						meetDetail.signState == 1 && meetDetail.state < 2? 
						<Button type='primary' disabled className='full-btn'>已签到</Button> : null
					}
				</View>
				
			</View>
		)
	}
}

export default Index
