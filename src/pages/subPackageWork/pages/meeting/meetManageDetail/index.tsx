import Taro, { Component, Config } from '@tarojs/taro'
import { Block, View, Text, ScrollView, Picker, Image, Input, Switch, Canvas } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { MeetManageDetailProps, MeetManageDetailState } from './index.interface'
import Dimage from '../../../../pages/common/dimage'
import drawQrcode from '../../../../libs/webQrcode'
const remoteImgPreUrl = process.env.remoteImgPreUrl

import './index.scss'
const arrR = remoteImgPreUrl + 'images/subPackageWork/arrR.png';
const upload = remoteImgPreUrl + 'images/subPackageWork/upload.png';
const delet = remoteImgPreUrl + 'images/subPackageWork/delet.png';
const notice = remoteImgPreUrl + 'images/subPackageWork/notice.png';

@connect(({ meetManageDetail, orgPopView, userPopView }) => ({
    ...meetManageDetail,
    joinOrg: orgPopView.checkedList,
    joinUser: userPopView.checkedList
}))

class MeetManageDetail extends Component<MeetManageDetailProps,MeetManageDetailState > {
    config:Config = {
        navigationBarTitleText: '会议详情'
    }
    constructor(props: MeetManageDetailProps) {
        super(props)
        this.state = {
            tabs: [
                { code: '001',title: '会议编辑', list: [{},{},{},{},{}]},
                { code: '002',title: '签到管理', list: [{},{},{},{},{}]},
                { code: '003',title: '会议纪要', list: [{},{},{},{},{}]},
            ],
            current: 2,
            // tab - 0
            meetOrgNames: [
                { code: '001', name: '组织1' },
                { code: '002', name: '组织2' },
                { code: '003', name: '组织3' }
            ],
            meetOrgNamesIndex: -1,// 组织 序列
            meetOrgTypes: [
                { code: '001', name: '组织类别1' },
                { code: '002', name: '组织类别2' },
                { code: '003', name: '组织类别3' }
            ],
            meetOrgTypesIndex: -1,// 组织类别 序列
            meetStartTime: '',// 会议开始时间
            signInByLocation: false,// 是否选中经纬度签到
            joinOrg: [], // 参与组织
            joinUser: [], // 参与人员
            // tab - 1
            meetOrgNamesJY: [
                { code: '001', name: '组织1' },
                { code: '002', name: '组织2' },
                { code: '003', name: '组织3' }
            ],
            meetOrgNamesIndexJY: -1,// 组织 序列
            meetOrgTypesJY: [
                { code: '001', name: '组织类别1' },
                { code: '002', name: '组织类别2' },
                { code: '003', name: '组织类别3' }
            ],
            meetOrgTypesIndexJY: -1,// 组织类别 序列
            meetStartTimeJY: '',// 会议开始时间
            signInByLocationJY: false,// 是否选中经纬度签到
            joinUserJY: [], // 参与人员
            meetHostArrJY: [
                {name: '张三'},
                {name: '张三'},
                {name: '张三'}
            ], // 会议纪要主持
            meetHostValueJY: '',
            meetSpeakerArrJY: [
                {name: '张三'},
                {name: '张三'},
                {name: '张三'}
            ],// 会议纪要主将list
            meetSpeakerValueJY: '',
            
            modalIsOpened: false,// 弹层是否显示

            selectImageList: [],// 上传图片list
            isVideoMeet: 1,// 是否是视频会议： 1是；0不是
            personList: [{},{},{},{}], // 观看人员列表
        }
    }
    
    componentDidMount() {
        // 生成二维码 ---> 一分钟更新一次
        drawQrcode({
            canvasId: 'canvas',
            text: '8888888888888888',
            width: 200,
            height: 200
        });

        // 如果是视频会议 观看管理，否则叫 签到管理；
        const isVideoMeet = this.state.isVideoMeet;
        let tabs = this.state.tabs;
        tabs[1].title = ( isVideoMeet === 1 ) ? '观看管理' : '签到管理';
        this.setState({
            tabs
        });
    }

    componentDidShow() {
        if (this.props.joinOrg.length>0 || this.props.joinUser.length>0) {
            this.setState({
                joinOrg: this.props.joinOrg,
                joinUser: this.props.joinUser
            });
        }
    }


    // tab 点击切换事件
    tabClick(current){
        console.log(current)
        this.setState({
            current
        });
    }
    // **************** TAB - 0 ****************
    // 选择 组织
    onMeetOrgNamesChange(e){
        this.setState({
            meetOrgNamesIndex: e.detail.value
        });
    }
    
    // 选择组织
    onMeetOrgTypesChange(e){
        this.setState({
            meetOrgTypesIndex: e.detail.value
        });
    }

    // 选择时间
    onMeetStartTimeChange(e){
        console.log(e)
        this.setState({
            meetStartTime: e.detail.value
        });
    }

    // 是否经纬度签到
    onSwitchSignInByLocation(e){
        this.setState({
            signInByLocation: e.detail.value
        });
    }

    // 输入详细地址 监听
    inputDetailAddr(e){
        console.log(e.detail.value)
    }

    // 选择组织
    selectOrg(){
        // 0未开始 1进行中 2已结束 3已取消
        // if ( this.state.state==2 ) {
        //     return
        // }
        Taro.navigateTo({
            url: '/subPackageEco/pages/org/index'
        });
    }

    // 人员选择
    selectUser(){
        // 0未开始 1进行中 2已结束 3已取消
        // if ( this.state.state==2 ) {
        //     return
        // }
        Taro.navigateTo({
            url: '/subPackageEco/pages/user/index'
        });
    }

    //点击保存按钮
    saveEvt(){
        Taro.showModal({
            title: '提示',
            content: '该会议还未发起，需要立即发起吗？',
            cancelText: '暂不开启',
            confirmText: '立即发起',
        }).then(res => {
            console.log(res.confirm, res.cancel)
            if (res.confirm) {
                console.log('立即发起')
            }
        });
    }

    // **************** TAB - 2 *********会议纪要 相关*******
    // 切换 组织
    onMeetOrgNamesChangeJY(e){
        this.setState({
            meetOrgNamesIndexJY: e.detail.value
        });
    }
    
    // 切换 组织 类别
    onMeetOrgTypesChangeJY(e){
        this.setState({
            meetOrgTypesIndexJY: e.detail.value
        });
    }

    // 选择时间
    onMeetStartTimeChangeJY(e){
        console.log(e)
        this.setState({
            meetStartTimeJY: e.detail.value
        });
    }

    // 输入 主持 监听
    onMeetHostChangeJY(e){
        this.setState({
            meetHostValueJY: e.detail.value
        });
    }

    // 输入 主持 监听
    onMeetSpeakerChangeJY(e){
        this.setState({
            meetSpeakerValueJY: e.detail.value
        });
    }

    // 是否经纬度签到
    onSwitchSignInByLocationJY(e){
        this.setState({
            signInByLocationJY: e.detail.value
        });
    }

    // 输入详细地址 监听
    inputDetailAddrJY(e){
        console.log(e.detail.value)
    }

    // 人员选择
    selectUserJY(){
        // 0未开始 1进行中 2已结束 3已取消
        // if ( this.state.state==2 ) {
        //     return
        // }
        Taro.navigateTo({
            url: '/subPackageEco/pages/user/index'
        });
    }

    // 输入 参会人员 监听
    inputMeetPersonJY(){

    }
    

    //点击保存按钮
    saveEvtJY(){
        Taro.showModal({
            title: '提示',
            content: '确定修改吗？',
            cancelText: '取消',
            confirmText: '确定',
        }).then(res => {
            console.log(res.confirm, res.cancel)
            if (res.confirm) {
                console.log('修改')
            }
        });
    }

    // 上传附件 - 选择图片
    selectImage(){
        Taro.chooseImage({
            count: 1
        }).then((e)=>{
            console.log(e, e.tempFilePaths[0])
            const tempFilePath = e.tempFilePaths[0];
            this.upLoadImgApi(tempFilePath);
        })
    }

    // 上传图片
    upLoadImgApi(_file){
        Taro.showLoading({
            mask: true,
            title: '加载中'
        });
        const { dispatch } = this.props;
        const _objdata = {
            file: _file,
            businessName: 'activity',// 文件夹名字，活动 统一传 activity
        }
        dispatch({
            type: 'meetManageDetail/imageUpload',
            payload: _objdata,
            callback: (res) => {
                Taro.hideLoading();
                if(res.data){
                    const imageUploadBack = JSON.parse(res.data);
                    console.log(imageUploadBack)
                    const selectImageListItem = {
                        name: imageUploadBack.filename,
                        id: imageUploadBack.id,
                        path: imageUploadBack.path,
                        type: imageUploadBack.type,
                        size: imageUploadBack.size 
                    };
                    const selectImageList = this.state.selectImageList;
                    selectImageList.concat(selectImageListItem);
                    this.setState({
                        selectImageList
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

    // 点击加载更多
    loadMoreEvt(e){
        console.log(e)
    }
    
    render() {
        const { tabs, current, meetOrgNames, meetOrgNamesIndex, joinUser,
            meetOrgTypes, meetOrgTypesIndex, meetStartTime, signInByLocation,
            meetOrgNamesJY, meetOrgNamesIndexJY, meetOrgTypesJY, meetOrgTypesIndexJY, meetStartTimeJY, signInByLocationJY,
            joinUserJY, meetHostValueJY, meetSpeakerValueJY, selectImageList, 
            isVideoMeet, personList } = this.state;
        return (
        <View className={`meetManageDetail-wrap ${isVideoMeet?'haveTopAdv':''}`}>
            <View className='garyLineSpace'></View>
            <AtTabs
                current={current}
                scroll
                tabList={tabs} 
                onClick={this.tabClick.bind(this)}>
                    {/* TAB - 0 */}
                    <AtTabsPane current={current} index={current}>
                        <ScrollView className='tabsCom' scrollY scrollWithAnimation onScrollToLower={this.loadMoreEvt.bind(this)}>
                            <View style={isVideoMeet?{height: '160rpx'}:{height: '114rpx'}}></View>
                            <Block>
                                <View className='flex md-list'>
                                    <Text className='bigLabel'>是否视频会议</Text>
                                    <Text className='bigLabel'>是</Text>
                                </View>
                                <View className='md-list'>
                                    <Picker value={2} className='picker' mode='selector' range={meetOrgNames} rangeKey='name' 
                                        onChange={this.onMeetOrgNamesChange.bind(this)}>
                                        <View className='flex'>
                                            <View>
                                                <View className='smallLabel'>组织名称</View>
                                                <View className='bigLabel'>
                                                    {
                                                        meetOrgNamesIndex > -1 ? 
                                                        meetOrgNames[meetOrgNamesIndex].name : 
                                                        <Text className='gray'>请选择组织名称</Text>
                                                    }
                                                </View>
                                            </View>
                                            <Image className='arrR' src={arrR} mode='aspectFill' />
                                        </View>
                                    </Picker>
                                </View>
                                <View className='md-list'>
                                    <Picker value={2} className='picker' mode='selector' range={meetOrgTypes} rangeKey='name' 
                                        onChange={this.onMeetOrgTypesChange.bind(this)}>
                                        <View className='flex'>
                                            <View>
                                                <View className='smallLabel'>组织类型</View>
                                                <View className='bigLabel'>
                                                    {
                                                        meetOrgTypesIndex > -1 ? 
                                                        meetOrgTypes[meetOrgTypesIndex].name : 
                                                        <Text className='gray'>请选择组织类型</Text>
                                                    }
                                                </View>
                                            </View>
                                            <Image className='arrR' src={arrR} mode='aspectFill' />
                                        </View>
                                    </Picker>
                                </View>
                                <View className='md-list'>
                                    <View className='smallLabel'>会议议题</View>
                                    <Input className='mdInput' placeholder='请输入会议议题' placeholderClass='gray'/>
                                </View>
                                <View className='md-list'>
                                    <View className='smallLabel'>会议主题</View>
                                    <Input className='mdInput' placeholder='请输入会议主题' placeholderClass='gray'/>
                                </View>
                                <View className='grayLineSpace'></View>
                                <View className='flex md-list'>
                                    <Picker value={meetStartTime} className='twoCol' mode='date' 
                                        onChange={this.onMeetStartTimeChange.bind(this)}>
                                        <View className='bigLabel'>开始时间</View>
                                        <View className='mdInput'>
                                            {meetStartTime.length > 0 ? meetStartTime : <Text className='gray'>请选择会议时间</Text>}
                                        </View>
                                    </Picker>
                                    <View className='twoCol borderL'>
                                        <View className='bigLabel'>会议时长</View>
                                        <Input className='mdInput' placeholder='请输入会议时长' type='number' placeholderClass='gray'/>
                                    </View>
                                </View>
                                <View className='flex md-list'>
                                    <View className='bigLabel'>经纬度签到</View>
                                    <Switch onChange={this.onSwitchSignInByLocation.bind(this)} checked={signInByLocation} color='#FF4D4F'/>
                                </View>
                                <View className='md-list'>
                                    <View className='bigLabel'>会议地点</View>
                                    <View className='flex contentStart selectAddr'>
                                        <AtIcon value='map-pin' size='20' color='#999'></AtIcon>
                                        <Text className='gray'>点击选择会议地址</Text>
                                    </View>
                                    <View className='mdInput'>
                                        <Input 
                                            name='detailAddr' 
                                            className='re-input'
                                            placeholder='请输入会议室详细地址 [例: 15号楼5层501室]' 
                                            placeholderClass='gray' 
                                            onInput={this.inputDetailAddr.bind(this)}
                                        />
                                    </View>
                                </View>
                                <View className='grayLineSpace'></View>
                                <View className='flex md-list' onClick={this.selectOrg.bind(this)}>
                                    <Text className='bigLabel'>参会组织</Text>
                                    <View className='flex contentEnd size32 gray'>
                                        <Text className='size32 gray'>3个组织</Text>
                                        <Image className='arrR' src={arrR} mode='aspectFill' />
                                    </View>
                                </View>
                                <View className='flex md-list' onClick={this.selectUser.bind(this)}>
                                    <Text className='bigLabel'>参会人员</Text>
                                    <View className='flex contentEnd'>
                                        <Dimage
                                            type="image"
                                            src='https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64'
                                            mode='aspectFit'
                                            styleValue='height: 52rpx; width: 52rpx; border-radius: 50%; vertical-align:middle; margin-right: 10rpx;'
                                        /> 
                                        <Dimage
                                            type="image"
                                            src='https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64'
                                            mode='aspectFit'
                                            styleValue='height: 52rpx; width: 52rpx; border-radius: 50%; vertical-align:middle; margin-right: 10rpx;'
                                        />
                                        {/* {joinUser} */}
                                        <Text className='size32 gray'>等20人</Text>
                                        <Image className='arrR' src={arrR} mode='aspectFill' />
                                    </View>
                                </View>
                                
                                <View className='md-list'>
                                    <View className='smallLabel'>会议介绍</View>
                                    <Input className='mdInput' placeholder='请输入会议介绍' placeholderClass='gray'/>
                                </View>
                                <View className='md-list flex btnCom'>
                                    <View className='deletBtn active'>删除</View>
                                    <View className='saveBtn active' onClick={this.saveEvt.bind(this)}>保存</View>
                                </View>

                            </Block>

                        </ScrollView>
                    </AtTabsPane>
                    {/* TAB - 1 */}
                    <AtTabsPane current={current} index={current}>
                        <ScrollView className='tabsCom' scrollY scrollWithAnimation onScrollToLower={this.loadMoreEvt.bind(this)}>
                            <View style={isVideoMeet?{height: '160rpx'}:{height: '114rpx'}}></View>
                            <View className='canvasCom'>
                                <View className='ca-title'>关于学习党的理论会议关于学习党的理论会议</View>
                                <View className='flex timeAndOther gray size24'>
                                    <Text>2019.04.20 14:00</Text>
                                    <Text>已观看 20 人    未观看 30 人</Text>
                                </View>
                                {
                                    isVideoMeet ? 
                                    <Block>
                                        {/* 非视频 会议 */}
                                        {
                                            personList.map((item, index)=>{
                                                return (
                                                    <View className='flex itemCenter personList'>
                                                        <View className='flex contentStart itemCenter'>
                                                            <Dimage 
                                                                mode='aspectFit' 
                                                                src='https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64' 
                                                                type='avatar' 
                                                                styleValue='height: 64rpx;width: 64rpx;border-radius: 50%; margin-right: 20rpx;'
                                                            />
                                                            <Text className='size28'>张光明</Text>
                                                        </View>
                                                        <View className='gray size28'>观看视频  00:30:00</View>
                                                    </View>
                                                )
                                            })
                                        }
                                    </Block> : 
                                    <Block>
                                        {/* 非视频 会议 */}
                                        <View className='s-title'>会议签到二维码，扫一扫</View>
                                        <Canvas canvasId='canvas' className='canvas'/>
                                        <View className='ca-twobtn flex'>
                                            <Text className='active'>分享图片</Text>
                                            <Text className='active'>保存图片</Text>
                                        </View>
                                        <View className='openSign active'>开启签到</View>
                                        <View className='flex size32 gray'>
                                            <View>
                                                <Dimage 
                                                    mode='aspectFit' 
                                                    src='https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64' 
                                                    type='avatar' 
                                                    styleValue='height: 52rpx;width: 52rpx;border-radius: 50%; margin-right: 6px;'
                                                />
                                                <Dimage 
                                                    mode='aspectFit' 
                                                    src='https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64' 
                                                    type='avatar' 
                                                    styleValue='height: 52rpx;width: 52rpx;border-radius: 50%; margin-right: 6px;'
                                                />
                                                <Dimage 
                                                    mode='aspectFit' 
                                                    src='https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64' 
                                                    type='avatar' 
                                                    styleValue='height: 52rpx;width: 52rpx;border-radius: 50%; margin-right: 6px;'
                                                /> 
                                            </View>
                                            <View>
                                                等40人已签到
                                                <Image 
                                                    className='arrR' 
                                                    mode='aspectFit' 
                                                    src={arrR}
                                                /> 
                                            </View>
                                        </View>
                                    </Block>
                                }
                                    
                                

                            </View>
                        </ScrollView>
                    </AtTabsPane>
                    {/* TAB - 2 */}
                    <AtTabsPane current={current} index={current}>
                        <ScrollView className='tabsCom' scrollY scrollWithAnimation onScrollToLower={this.loadMoreEvt.bind(this)}>
                            <View style={isVideoMeet?{height: '160rpx'}:{height: '114rpx'}}></View>
                            <View className='meetJY'>
                                <View className='flex md-list'>
                                    <Text className='bigLabel'>是否视频会议</Text>
                                    <Text className='bigLabel'>是</Text>
                                </View>
                                <View className='md-list'>
                                    <Picker value={2} className='picker' mode='selector' range={meetOrgNamesJY} rangeKey='name' 
                                        onChange={this.onMeetOrgNamesChangeJY.bind(this)}>
                                        <View className='flex'>
                                            <View>
                                                <View className='smallLabel'>组织名称</View>
                                                <View className='bigLabel'>
                                                    {
                                                        meetOrgNamesIndexJY > -1 ? 
                                                        meetOrgNamesJY[meetOrgNamesIndexJY].name : 
                                                        <Text className='gray'>请选择组织名称</Text>
                                                    }
                                                </View>
                                            </View>
                                            <Image className='arrR' src={arrR} mode='aspectFill' />
                                        </View>
                                    </Picker>
                                </View>
                                <View className='md-list'>
                                    <Picker value={2} className='picker' mode='selector' range={meetOrgTypesJY} rangeKey='name' 
                                        onChange={this.onMeetOrgTypesChangeJY.bind(this)}>
                                        <View className='flex'>
                                            <View>
                                                <View className='smallLabel'>组织类型</View>
                                                <View className='bigLabel'>
                                                    {
                                                        meetOrgTypesIndexJY > -1 ? 
                                                        meetOrgTypesJY[meetOrgTypesIndexJY].name : 
                                                        <Text className='gray'>请选择组织类型</Text>
                                                    }
                                                </View>
                                            </View>
                                            <Image className='arrR' src={arrR} mode='aspectFill' />
                                        </View>
                                    </Picker>
                                </View>
                                <View className='md-list'>
                                    <View className='smallLabel'>会议议题</View>
                                    <Input className='mdInput' placeholder='请输入会议议题' placeholderClass='gray'/>
                                </View>
                                <View className='md-list'>
                                    <View className='smallLabel'>会议主题</View>
                                    <Input className='mdInput' placeholder='请输入会议主题' placeholderClass='gray'/>
                                </View>
                                <View className='grayLineSpace'></View>
                                <View className='flex md-list'>
                                    <Picker value={meetStartTimeJY} className='twoCol' mode='date' 
                                        onChange={this.onMeetStartTimeChangeJY.bind(this)}>
                                        <View className='bigLabel'>开始时间</View>
                                        <View className='mdInput'>
                                            {meetStartTimeJY.length > 0 ? meetStartTimeJY : <Text className='gray'>请选择会议时间</Text>}
                                        </View>
                                    </Picker>
                                    <View className='twoCol borderL'>
                                        <View className='bigLabel'>会议时长</View>
                                        <Input className='mdInput' placeholder='请输入会议时长' type='number' placeholderClass='gray'/>
                                    </View>
                                </View>
                                <View className='flex md-list'>
                                    <View className='bigLabel'>经纬度签到</View>
                                    <Switch onChange={this.onSwitchSignInByLocationJY.bind(this)} checked={signInByLocationJY} color='#FF4D4F'/>
                                </View>
                                <View className='md-list'>
                                    <View className='bigLabel'>会议地点</View>
                                    <View className='flex contentStart selectAddr'>
                                        <AtIcon value='map-pin' size='20' color='#999'></AtIcon>
                                        <Text className='gray'>点击选择会议地址</Text>
                                    </View>
                                    <View className='mdInput'>
                                        <Input 
                                            name='detailAddr' 
                                            className='re-input'
                                            placeholder='请输入会议室详细地址 [例: 15号楼5层501室]' 
                                            placeholderClass='gray' 
                                            onInput={this.inputDetailAddrJY.bind(this)}
                                        />
                                    </View>
                                </View>

                                <View className='grayLineSpace'></View>
                                <View className='flex md-list'>
                                    <View className='bigLabel'>会议主持</View>
                                    <Input className='meetPersonInput' value={meetHostValueJY} placeholder='请输入会议主持' 
                                        onInput={this.onMeetHostChangeJY.bind(this)} />
                                </View>
                                <View className='flex md-list'>
                                    <View className='bigLabel'>会议主持</View>
                                    <Input className='meetPersonInput' value={meetSpeakerValueJY} placeholder='请输入会议主持' 
                                        onInput={this.onMeetSpeakerChangeJY.bind(this)} />
                                </View>
                                
                                <View className='md-list'>
                                    <View className='flex'>
                                        <Text className='bigLabel'>参会情况</Text>
                                        <Input 
                                            name='meetPerson' 
                                            className='meetPersonInput'
                                            placeholder='点击修改应参会人数' 
                                            placeholderClass='gray' 
                                            onInput={this.inputMeetPersonJY.bind(this)}
                                        />
                                    </View>
                                    <View className='meetPersonDetail'>应参会20人 实到18人 缺席2人 参与率90%</View>
                                </View>
                                    
                                <View className='flex md-list' onClick={this.selectUserJY.bind(this)}>
                                    <Text className='bigLabel'>参会人员</Text>
                                    <View className='flex contentEnd'>
                                        <Dimage
                                            type="image"
                                            src='https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64'
                                            mode='aspectFit'
                                            styleValue='height: 52rpx; width: 52rpx; border-radius: 50%; vertical-align:middle; margin-right: 10rpx;'
                                        /> 
                                        <Dimage
                                            type="image"
                                            src='https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64'
                                            mode='aspectFit'
                                            styleValue='height: 52rpx; width: 52rpx; border-radius: 50%; vertical-align:middle; margin-right: 10rpx;'
                                        /> 
                                        {/* {joinUserJY} */}
                                        <Text className='size32 gray'>等20人</Text>
                                        <Image className='arrR' src={arrR} mode='aspectFill' />
                                    </View>
                                </View>
                                
                                <View className='md-list borderB'>
                                    <View className='smallLabel'>会议纪要</View>
                                    <Input className='mdInput' placeholder='请输入会议纪要' placeholderClass='gray'/>
                                </View>
                                <View className='md-list upload-list'>
                                    <View className='flex'>
                                        <Text className='bigLabel'>上传附件</Text>
                                        <Image className='upload active' 
                                            onClick={this.selectImage.bind(this)} 
                                            src={upload} mode='aspectFit' 
                                            />
                                    </View>
                                    <View className='flex contentStart flexWrap imgsCom'>
                                        <View className='imgs'>
                                            <Dimage
                                                type="image"
                                                src='https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64'
                                                mode='aspectFit'
                                                styleValue='height: 96rpx; width: 96rpx; border-radius: 6rpx;'
                                            />
                                            <Image className='deletImg active' src={delet} mode='aspectFill' />
                                        </View>
                                        <View className='imgs'>
                                            {
                                                selectImageList.map((item)=>{
                                                    return (
                                                        <Dimage
                                                            type="image"
                                                            src={ remoteImgPreUrl + item.path }
                                                            mode='aspectFit'
                                                            styleValue='height: 96rpx; width: 96rpx; border-radius: 6rpx;'
                                                        />
                                                    )
                                                })
                                            }
                                            
                                            <Image className='deletImg active' src={delet} mode='aspectFill' />
                                        </View>
                                    </View>
                                </View>


                                <View className='md-list flex btnCom bigBtnCom'>
                                    <View className='saveBtn active' onClick={this.saveEvt.bind(this)}>保存</View>
                                </View>

                            </View>

                           
                        </ScrollView>
                    </AtTabsPane>
                    
            </AtTabs>
            {/* 页面顶部 发起视频会议 黄条条 */}
            {
                isVideoMeet ? 
                <View className='isVideoMeet flex'>
                    <View className='flex contentStart'>
                        <Image className='icon' src={notice} mode='aspectFill' />
                        <View className='meetName ellOneLine'>我是会议名称我是会议名称我是会议名称</View>
                    </View>
                    <View className='btn active'>发起视频会议</View>
                </View> : null
            }
            <View ></View>
        </View>
        )
    }
}

export default MeetManageDetail
