
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtIcon, AtSwitch, AtInput, AtButton } from 'taro-ui'
import { ImeetReleaseProps, ImeetReleaseState } from './index.interface'
import Dimage from '../../../../pages/common/dimage'
import './index.scss'

@connect(({ meetRelease, orgSinglePopView, orgPopView, userPopView }) => ({
	...meetRelease,
	orgType: orgSinglePopView.checkedOrg, // 所属 组织 => 单选
	joinOrgList: orgPopView.checkedList,
	joinUserList: userPopView.checkedList,
}))

class MeetRelease extends Component<ImeetReleaseProps, ImeetReleaseState> {
	config: Config = {
		navigationBarTitleText: '会议发布'
	}
	constructor(props: ImeetReleaseProps) {
		super(props)
		this.state = {
			meetingModality: 0,// 会议形式：0线下会议 1视频会议. ,
			meetTypeArray: [],// 所属会议类型列表
			meetTypeArrayIndex: -1,// 所属会议类型 序列

			orgName: '', // 所属组织 name
			orgId: '', // 所属组织 id
			orgCode: '', // 所属组织 code
			orgTypeId: '',// 所属组织 typeId

			startDate: '', // 开始日期
			startTime: '', // 开始时间
			joinOrgList: [],// 组织列表
			joinUserList: [],// 用户列表
			meetTimeArray: [
				{ code: '001', name: '30分钟', value: 30 },
				{ code: '002', name: '1小时', value: 60 },
				{ code: '003', name: '1.5小时', value: 90 },
				{ code: '004', name: '2小时', value: 120 },
				{ code: '005', name: '2.5小时', value: 150 },
				{ code: '006', name: '3小时', value: 180 }
			], // 会议视频时间 30 60 90 120 150 180 分钟
			meetTimeArrayIndex: null,
			needMap: 0,// 是否需要经纬度签到. 0不需要 1需要
			name: '',// 会议主题
			topic: '',// 会议议题
			content: '', // 会议内容
			meetingDuration: '',//会议时长--手输的
			mapAddress: '',// 地址文本
			latitude: '',// 选地图 带来的 经纬度
			longitude: '',// 选地图 带来的 经纬度
			meetingAddress: '', // 会议地址（手动输入）
		}
	}

	componentDidMount() {
		this.getListMeetType();
	}

	componentDidShow(){
		const orgType =  this.props.orgType; // 所属组织
		// orgType:{
		// 	code: "281563040420393072"
		// 	id: "281563040420393071"
		// 	name: "党委党总支0"
		// 	typeId: "280491287883419648"
		// },
		const joinUserList = this.props.joinUserList; // 参与人员
		const joinOrgList = this.props.joinOrgList; // 参与组织
        this.setState({
			orgName: orgType.name, 
			orgId: orgType.id, 
			orgCode: orgType.code, 
			orgTypeId: orgType.typeId,
            joinUserList,
			joinOrgList,
		});
		console.log('*****所属组织 单选************',this.props.orgType)
	}

	//是否是视频会议监听
	onSwitchIsVideo(_meetingModality) {
		this.setState({
			meetingModality: _meetingModality ? 1 : 0
		});
	}

	// 如果 是 视频会议，可以选择时间
	onSelectMeetTime(e){
		this.setState({
			meetTimeArrayIndex: e.detail.value
		});
	}

	//选择 所属组织
	onSelectOrgName() {
		// 跳去公共组件选择
		Taro.navigateTo({
			url: '/pages/common/orgSinglePopView/orgSinglePopView'
		});
	}

	// 获取 会议类型 列表 接口
	getListMeetType(){
		const { dispatch } = this.props;
        const _objdata  = {};
		// 新增
		dispatch({
            type: 'meetRelease/getListMeetType',
            payload: _objdata,
            callback: (res) => {
                Taro.hideLoading();
                if(res.code==1){
					console.log(res)
					this.setState({
						meetTypeArray: res.data
					})
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

	// 选择 会议类型 名称
	onSelectMeetType = (e) => {
		this.setState({
			meetTypeArrayIndex: e.detail.value
		})
	}


	// 输入监听 会议议题
	inputMeetIssue(topic){
		this.setState({
			topic // 会议议题.
		});
	}

	// 输入监听 会议主题
	inputMeetTitle(name){
		this.setState({
			name // 会议主题.
		});
	}
	

	// 日期选择
	onDateChange = (e) => {
		this.setState({
			startDate: e.detail.value
		});
	}

	// 时间选择
	onTimeChange = (e) =>{
		this.setState({
			startTime: e.detail.value
		});
	}

	// 输入监听 会议时长 
	meetDuration(meetingDuration){
		this.setState({
			meetingDuration // 会议时长 分钟
		});
	}

	// 是否可以 经纬度签到 
	onSwitchSignInByLocation(needMap) {
		this.setState({
			needMap
		});
	}
	
	// 点击去选择 带经纬度的 地址
	selectMeetAddress(){
		Taro.chooseLocation().then((res)=>{
			console.log(res)
			// address: "江苏省扬州市广陵区文昌中路548号"
			// errMsg: "chooseLocation:ok"
			// latitude: 32.39463
			// longitude: 119.43157
			// name: "仙鹤寺扬州市广陵区人民政府(文昌中路)"
			this.setState({
				mapAddress: res.address,// 地址文本
				latitude: res.latitude,// 选地图 带来的 经纬度
				longitude: res.longitude,// 选地图 带来的 经纬度
			});
		});
	}

	// 输入详细地址 监听
	inputDetailAddr(meetingAddress){
		this.setState({
			meetingAddress
		});
	}
  

	// 组织选择 list
	handleChooseOrg() {
		Taro.navigateTo({
			//url: '/pages/common/orgPopView/orgPopView'
			url: '/subPackageEco/pages/org/index'
		})
	}

	// 人员选择
	handleChooseUser() {
		Taro.navigateTo({
			//url: '/pages/common/userPopView/userPopView'
			url: '/subPackageEco/pages/user/index'
		})
	}


	
	// 输入监听 会议内容
	inputMeetContent(content){
		this.setState({
			content // 会议内容.
		});
	}

	// 去发布会议
	
	goReleaseMeet(){
		const { needMap, mapAddress,orgName, orgId, orgCode, orgTypeId, 
			startDate, startTime,meetingAddress,meetTimeArrayIndex,name,topic,content,
			joinUserList,joinOrgList, meetTypeArrayIndex } = this.state;
		// 必填校验 - 如果需要经纬度签到，经纬度地址必填
		if (needMap && mapAddress.length===0) {
			Taro.showModal({
				title: '提示',
				content: '这是一个模态弹窗',
				showCancel: false
			});
			return
		}
		// 必填校验
		
		if ( meetTimeArrayIndex === null || joinUserList.length === 0 || joinOrgList.length === 0
			|| orgName ==='' || orgId ==='' || orgCode ==='' || orgTypeId ==='' || startTime ==='' 
			|| startDate ==='' || name === '' || topic === '' || content === '' || meetTypeArrayIndex== -1
			|| meetingAddress === '' ) {
			Taro.showModal({
				title: '提示',
				content: '请将信息填写完整哦~',
				showCancel: false
			});
			return
		}

		Taro.navigateTo({
			url: '/subPackageWork/pages/meeting/meetMsgMind/index?prePageData=' + JSON.stringify(this.state)
		});
	}

	render() {
		const { meetingModality, joinOrgList,joinUserList, orgName, meetTypeArray, 
			meetTypeArrayIndex, startTime, meetTimeArray, meetTimeArrayIndex, startDate, needMap,
			mapAddress } = this.state;
		return (
		<View className='activity-releasemeet'>

			<View className='wide-line'></View>

			<View className='activity-releasemeet-form'>

				<View className='at-row activity-releasemeet-form-item'>
					<View className='at-col at-col-5' style='line-height: 64rpx;'>
						<View>是视频会议</View>
					</View>
					<View className='at-col at-col-7'>
						<AtSwitch checked={meetingModality?true:false} onChange={this.onSwitchIsVideo.bind(this)} border={false} color='#FF4D4F'/>
					</View>
				</View>

				{/* 新增视频会议时间 ==> 30分钟 ......3小时; */}
				{
					meetingModality ? 
					<Picker value={meetTimeArrayIndex} mode='selector' range={meetTimeArray} rangeKey='name' onChange={this.onSelectMeetTime.bind(this)}>
						<View className='at-row activity-releasemeet-form-item'>
							<View className='at-col at-col-11'>
								<View className='activity-releasemeet-form-item-small_title'>视频会议时间</View>
								<View>{ meetTimeArrayIndex ? meetTimeArray[meetTimeArrayIndex].name : <Text className='gray'>请选择视频会议时间</Text>}</View>
							</View>
							<View className='at-col at-col-1 arrow-root'>
								<AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
							</View>
						</View>
					</Picker> : null
				}

				<View className='at-row activity-releasemeet-form-item' onClick={this.onSelectOrgName.bind(this)}>
					<View className='at-col at-col-11'>
						<View className='activity-releasemeet-form-item-small_title'>所属组织</View>
						<View>{ orgName ? orgName : <Text className='gray'>请选择组织名称</Text>}</View>
					</View>
					<View className='at-col at-col-1 arrow-root'>
						<AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
					</View>
				</View>


				<Picker value={meetTypeArrayIndex} mode='selector' range={meetTypeArray} rangeKey='name' 
					onChange={this.onSelectMeetType.bind(this)}>
					<View className='at-row activity-releasemeet-form-item'>
					<View className='at-col at-col-11'>
						<View className='activity-releasemeet-form-item-small_title'>会议类型</View>
						<View>{ meetTypeArrayIndex > -1 ? meetTypeArray[meetTypeArrayIndex].name : <Text className='gray'>请选择会议类型</Text>}</View>
					</View>
					<View className='at-col at-col-1 arrow-root'>
						<AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
					</View>
					</View>
				</Picker>

				<View className='at-row activity-releasemeet-form-item'>
					<View className='at-col at-col-12'>
					<View className='activity-releasemeet-form-item-small_title'>会议议题</View>
					<AtInput
						className='input'
						name='meet_issue'
						type='text'
						border={false}
						placeholder='请输入会议议题'
						onChange={this.inputMeetIssue.bind(this)}
					/>
					</View>
				</View>

				<View className='at-row activity-releasemeet-form-item'>
					<View className='at-col at-col-12'>
					<View className='activity-releasemeet-form-item-small_title'>会议主题</View>
					<AtInput
						className='input'
						name='meet_subject'
						type='text'
						border={false}
						placeholder='请输入会议主题'
						onChange={this.inputMeetTitle.bind(this)}
					/>
					</View>
				</View>

				<View className='wide-line'></View>

				<View className='at-row activity-releasemeet-form-item'>
					<View className='at-col at-col-6'>
						<Picker value={startDate} mode='date' onChange={this.onDateChange.bind(this)}>
							<View>开始日期</View>
							<View className='activity-releasemeet-form-item-date'>
								<View className='picker'>
									{ startDate ? startDate : <Text className='gray'>点击选择</Text> }
								</View>
							</View>
						</Picker>
					</View>
					
					<View className='at-col at-col-6 borderL'>
						<Picker value={startTime} mode='time' onChange={this.onTimeChange.bind(this)}>
							<View>开始时间</View>
							<View className='activity-releasemeet-form-item-date'>
								<View className='picker'>
									{ startTime ? startTime : <Text className='gray'>点击选择</Text> }
								</View>
							</View>
						</Picker>
					</View>
				</View>
				<View className='flex mypad borderB'>
					<View>会议时长（分钟）</View>
					<AtInput
						className='input'
						border={false}
						name='meetTime'
						type='number'
						placeholder='点击输入'
						placeholderClass='gray'
						onChange={this.meetDuration.bind(this)}
					/>
				</View>
			</View>


			<View className='at-row activity-releasemeet-form-item'>
			<View className='at-col at-col-5' style='line-height: 64rpx;'>
				<View>经纬度签到</View>
			</View>
			<View className='at-col at-col-7'>
				<AtSwitch onChange={this.onSwitchSignInByLocation.bind(this)} border={false} color='#FF4D4F'/>
			</View>
			</View>
			
			<View className='at-col activity-releasemeet-form-item'>
				<View className='activity-releasemeet-form-item-small_title'>会议地点</View>
				<View className='flex contentStart padT20' onClick={this.selectMeetAddress.bind(this)}>
					<AtIcon value='map-pin' size='20' color='#999'></AtIcon>
					{
						mapAddress ? mapAddress : <View className='gray'>点击选择会议地址{needMap?'':'（选填）'}</View>
					}
				</View>
				<View className='mindInput'>
					<AtInput 
						name='detailAddr' 
						className='re-input'
						placeholder='请输入会议室详细地址 [例: 15号楼5层501室]' 
						placeholderClass='gray' 
						onChange={this.inputDetailAddr.bind(this)}
					/>
				</View>
			</View>

			<View className='wide-line'></View>

			<View className='at-row activity-releasemeet-form-item' >
				<View className='at-row activity-create-form-item' onClick={this.handleChooseOrg}>
					<View className='at-col at-col-5'>
						<View>参与组织</View>
					</View>
					<View className='at-col at-col-6 select-root'>
						<View className='activity-create-form-item-content'>
						
						{
							joinOrgList.length>0 ? <Text>{joinOrgList.length}个组织</Text>
							: <Text className='gray'>请选择参会组织</Text>
						}
						</View>
					</View>
					<View className='at-col at-col-1 arrow-root'>
						<AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
					</View>
				</View>
			</View>

			<View className='at-row activity-releasemeet-form-item' onClick={this.handleChooseUser}>
				<View className='at-col at-col-5'>
					<View>参会人员</View>
				</View>
				<View className='at-col at-col-6'>
					<View className='activity-releasemeet-form-item-content'>
					{
						joinUserList.map((avatar_item,avatar_index)=>{
							return(
								avatar_index>2 ? null : 
								<Dimage mode='aspectFit' src={avatar_item.avatar} type='avatar'
                        			styleValue='height: 52rpx;width: 52rpx;border-radius: 50%; margin-right: 10rpx;' />
							)
						})
					}
					
					{
						joinUserList.length>0 ? <Text>{joinUserList.length>3 ? '等' : ''}{joinUserList.length}人</Text>
						: <Text className='gray'>请选择参会人员</Text>
					}
					
					</View>
				</View>
				<View className='at-col at-col-1 arrow-root'>
					<AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
				</View>
			</View>


			<View className='at-col activity-releasemeet-form-item'>
			<View className='at-col at-col-12'>
				<View className='activity-releasemeet-form-item-small_title'>会议介绍</View>
				<AtInput
					className='input'
					name='meet_issue'
					type='text'
					border={false}
					placeholder='请输入会议内容介绍'
					onChange={this.inputMeetContent.bind(this)}
				/>
			</View>
			</View>
			<View className='next-btn'>
				<AtButton type='primary' onClick={this.goReleaseMeet.bind(this)}>发布会议</AtButton>
			</View>
		</View>
		)
	}
}

export default MeetRelease
