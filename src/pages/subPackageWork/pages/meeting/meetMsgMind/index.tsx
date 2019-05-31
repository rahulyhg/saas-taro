import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { ImeetMsgMindProps, ImeetMsgMindState } from './index.interface';
import { formatDate, debounce } from '../../../../utils/common'
const check = process.env.remoteImgPreUrl + 'images/common/check.png';
const checkOver = process.env.remoteImgPreUrl + 'images/common/checkOver.png';
import './index.scss'

@connect(({ meetMsgMind }) => ({
    ...meetMsgMind,
}))

class ImeetMsgMind extends Component<ImeetMsgMindProps,ImeetMsgMindState > {
    config:Config = {
        navigationBarTitleText: '会议'
    }
    constructor(props: ImeetMsgMindProps) {
        super(props)
        this.state = {
            msg_out_check: false,
            msg_sys_check: false,
            prePageData: null,// 上一页带过来的参数

            cancelUserList: [], 
            newUserList: [], 
            relUserList: [], 
            msg: '',// 新增 短信消息内容
            cancelMsg: '',// 取消短信消息内容
        }
    }

    componentDidMount() {
        // 初始化
        const params = this.$router.params; // 页面参数
        const prePageData = JSON.parse(params.prePageData);
        const msg = `您好！请于 ${prePageData.startDate}  ${prePageData.startTime} 在 ${prePageData.mapAddress}${prePageData.meetingAddress} 参加 ${prePageData.meetTypeArray[prePageData.meetTypeArrayIndex].name}。`;
        const cancelMsg = `您好！原定于 ${prePageData.startDate}  ${prePageData.startTime} 在 ${prePageData.mapAddress}${prePageData.meetingAddress} 参加 ${prePageData.meetTypeArray[prePageData.meetTypeArrayIndex].name} 已取消。`;// 取消短信消息内容
        
        this.setState({
            prePageData,
            msg,
            cancelMsg
        },()=>{
            this.findRelUserList(''); // 会议id（修改时必传，新增时不传）
        });
        
    }

    // 根据选择的组织和人员查询真实的人员列表
    findRelUserList(_meetId){
        const { dispatch } = this.props;
        const _joinOrgList = this.state.prePageData.joinOrgList;
        let __joinOrgList:any = [];
        _joinOrgList.map((item)=>{
            __joinOrgList.push({
                code: item.orgId,// (string, optional): 编码 ,
                id: item.id,// (string, optional): 主键 ,
                name: item.name,// (string, optional): 组织名称 ,
                typeId: item.typeId,// (string, optional): 组织类型
            });
        });
        const _joinUserList = this.state.prePageData.joinUserList;
        let __joinUserList:any = [];
        _joinUserList.map((item)=>{
            __joinUserList.push({
                avatar: item.avatar,// (string, optional): 头像 ,
                id: item.userId,// (string, optional): 主键 ,
                userName: item.userName,// (string, optional): 昵称
            });
        });
        const _objdata  = {
            id: _meetId,// (string, optional): 会议主键，新增查询时不用传，修改时必传. ,
            joinOrgList: __joinOrgList,// (Array[SysOrgVO], optional): 发布时选择的组织列表. ,
            joinUserList: __joinUserList,// (Array[SysUserVO], optional): 发布时选择的人员列表.
		}
		// 新增
		dispatch({
            type: 'meetMsgMind/findRelUserList',
            payload: _objdata,
            callback: (res) => {
                Taro.hideLoading();
                if(res.code==1){
                    this.setState({
                        cancelUserList: res.data.cancelUserList,// 取消人员列表 【修改】会议时，需要发送取消消息的人员列表 ,
                        newUserList: res.data.newUserList,// 新增人员列表 【修改】会议时，需要发送新增消息的人员列表 ,
                        relUserList: res.data.relUserList,// 总人员列表 【新增】会议时需要发送的人员列表.
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
    
	// 新增 会议 接口
	addMeetApi = debounce(()=>{
        const { dispatch } = this.props;
        const _prePageData = this.state.prePageData;
        const _joinOrgList = _prePageData.joinOrgList;
        let __joinOrgList:any = [];
        _joinOrgList.map((item)=>{
            __joinOrgList.push({
                code: item.orgCode,// (string, optional): 编码 ,
                id: item.orgId,// (string, optional): 主键 ,
                name: item.orgName,// (string, optional): 组织名称 ,
                typeId: item.typeId,// (string, optional): 组织类型
                shortName: item.shortName,
            });
        });
        const _joinUserList = _prePageData.joinUserList;
        let __joinUserList:any = [];
        _joinUserList.map((item)=>{
            __joinUserList.push({
                avatar: item.avatar,// (string, optional): 头像 ,
                id: item.userId,// (string, optional): 主键 ,
                userName: item.userName,// (string, optional): 昵称
                mobilePhone: item.mobilePhone,
            });
        });
        const _startTime = formatDate(_prePageData.startDate + ' ' + _prePageData.startTime,'yyyy-MM-dd HH:mm:ss')
        const _objdata  = {
			orgName: _prePageData.orgName,// 组织名称. ,
			orgId: _prePageData.orgId,// 所属组织表id. ,
			orgCode: _prePageData.orgCode,// 所属组织表id. ,
            orgTypeId: _prePageData.orgTypeId,// 组织类型. ,
			meetingModality: _prePageData.meetingModality,// 会议形式：0线下会议 1视频会议. ,
			startTime: _startTime,// 
			mapAddress: _prePageData.mapAddress,// -- 非必填
			meetingAddress: _prePageData.meetingAddress,// 会议地址（手动输入） ,
			meetingDuration: _prePageData.meetingDuration,// 会议时长（手动输入）-- 非必填
			meetingVideoDuration: _prePageData.meetTimeArray[_prePageData.meetTimeArrayIndex].value, // ***** 视频类型 才传 ***** 单位分钟 30 60 90 120 150 180 6种 ,
			name: _prePageData.name,// 会议主题.
			topic: _prePageData.topic,// 会议议题. -- 非必填
			content: _prePageData.content,// 会议内容
			needMap: _prePageData.needMap ? 1 : 0,// 是否需要经纬度签到. 0不需要 1需要 ,
			latitude: _prePageData.latitude,// 
			longitude: _prePageData.longitude,// 
			typeName: _prePageData.meetTypeArray[_prePageData.meetTypeArrayIndex].name,// 会议类型名称.name
            typeId: _prePageData.meetTypeArray[_prePageData.meetTypeArrayIndex].id,// 会议类型 类型表的id. ,
            
            joinUserList: __joinUserList,// 发布时选择的人员列表.
                // {
                //     "id":"556995211223322",
                //     "userName":"超级管理员",
                //     "avatar":null,
                //     "mobilePhone":"13004302222"
                //     },
            joinOrgList: __joinOrgList,// 发布时选择的组织列表. ,
                // {
                // "id":"286304857837699072",
                // "code":"286304857837699073",
                // "name":"测试组织架构图3",
                // "shortName":"测试组织架构3",
                // "typeId":"280491287879225344"
                // } ,
            
			cancelMsg: this.state.cancelMsg,// 取消短信消息内容. ,
			msg: this.state.msg,
			isNeedMsg: this.state.msg_out_check,// 是否发送短信. ,
            isNeedSysMsg: this.state.msg_sys_check, // 是否发送站内信息. ,
		}
		// 新增
		dispatch({
            type: 'meetMsgMind/addMeet',
            payload: _objdata,
            callback: (res) => {
                Taro.hideLoading();
                if(res.code==1){
                    Taro.showToast({
                        title: '操作成功',
                        icon: 'success',
                        duration: 2000
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
	}, 300)

    // 点击切换check
    checkEvt(msg){
        if ( msg === 'msg_out') {
            this.setState({
                msg_out_check: !this.state.msg_out_check
            });
        } else if ( msg === 'msg_sys') {
            this.setState({
                msg_sys_check: !this.state.msg_sys_check
            });
        }
    }

    render() {
        const { msg_out_check, msg_sys_check, relUserList, msg, cancelMsg } = this.state;
        return (
            <View className='meetMsgMind-wrap'>
                <View className='grayLineSpace'></View>
                <View className='msgMdTit'>消息提醒</View>
                <View className='flex contentStart itemStart main' onClick={this.checkEvt.bind(this,'msg_out')}>
                    <Image className='checkIcon' src={ msg_out_check ? checkOver : check } mode='aspectFill'/>
                    <View className='contentMd'>
                        <View className='normal'>短信提醒</View>
                        <View className='subTit'>{/*目前可使用短信资源100条，*/}勾选后本次需发送{relUserList.length}条</View>
                        <View className='grayBgMd'>
                            <View className='grayBgMdTit'>参会短信模板</View>
                            <View className='grayBgMdText'>{msg}</View>
                            <View className='grayBgMdTit'>取消会议短信模板</View>
                            <View className='grayBgMdText'>{cancelMsg}</View>
                        </View>
                    </View>
                </View>
                <View className='flex contentStart itemStart main' onClick={this.checkEvt.bind(this,'msg_sys')}>
                    <Image className='checkIcon' src={ msg_sys_check ? checkOver : check } mode='aspectFill'/>
                    <View className='contentMd'>
                        <View className='normal'>应用内消息提醒</View>
                    </View>
                </View>
                <View className='btnCom active'>
                    <Button type='primary' onClick={this.addMeetApi.bind(this)}>确定</Button>
                </View>
            </View>
        )
    }
}

export default ImeetMsgMind
