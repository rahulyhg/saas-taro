import Taro, { Component, Config } from '@tarojs/taro'
import { View, Picker, Input } from '@tarojs/components'
import { AtTextarea, AtButton, AtIcon, AtSwitch } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { IcreateVoteProps, IcreateVoteState } from './index.interface'
import Dimage from '../../../../pages/common/dimage'
import './index.scss'


@connect(({ addVoteForm, orgPopView, userPopView  }) => ({
    ...addVoteForm,
    joinOrg: orgPopView.checkedList,
    joinUser: userPopView.checkedList
}))

class Activity extends Component<IcreateVoteProps,IcreateVoteState > {
    config:Config = {
        navigationBarTitleText: '发布投票活动'
    }
    constructor(props: IcreateVoteProps) {
        super(props)
        this.state = {
            title: '',// 标题
            content: '',// 内容
            startTime: '', // 开始日期
            endTime: '',// 截止日期
            cover: '',// 封面
            joinUser: [],// 参与人员
            joinOrg: [],// 参与组织
            peopleJoin: 0,// 是否 群众参与：0否 1是. ,
            anonymous: 0,// 是否 匿名：0否 1是. ,
            voteNum: null,// 每人可投票数
            repeatVote: 0,// 是否 可重复投票：0否 1是. ,
            
            
            activityTitleActive: false,
            activityExplainActive: false
        }
    }

    componentDidMount() {
        // const params = this.$router.params;// 页面参数
        
    }

    componentDidShow() {
        const joinUser = this.props.joinUser; // 参与人员
        const joinOrg = this.props.joinOrg; // 参与组织
        this.setState({
            joinUser,
            joinOrg
        });
    }

    // 标题与内容Change事件
    titleAndContentChange (type, e) {
        const inputValue:string = e.detail.value;
        this.setState({
            [type]: inputValue
        });
    }

    // 标题与内容FocusAndBlur事件
    titleAndContentFocusAndBlur(type) {
        if (type==='title') {
            this.setState({
                activityTitleActive: !this.state.activityTitleActive
            })
        } else if (type==='content') {
            this.setState({
                activityExplainActive: !this.state.activityExplainActive
            })
        }
        
    }

    // 选择时间change
    selectDate(type, e){
        // 'start' 开始日期； 'end'截止日期；
        const selectDateVal:string = e.detail.value;
        this.setState({
            [type]: selectDateVal
        });
        
    }

    // 选择图片
    selectImage(){
        Taro.chooseImage().then((e)=>{
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
            type: 'addVoteForm/imageUpload',
            payload: _objdata,
            callback: (res) => {
                Taro.hideLoading();
                if(res.data){
                    const cover = JSON.parse(res.data).path;
                    this.setState({
                        cover
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

    // 选择组织
    selectOrg(){
        Taro.navigateTo({
            url: '/subPackageEco/pages/org/index'
        })
    }

    // 人员选择
    selectUser(){
        Taro.navigateTo({
            url: '/subPackageEco/pages/user/index'
        })
    }

    // 输入 每人可投票数
    inputVoteNum(e){
        this.setState({
            voteNum: e.detail.value
        });
    }

    // switch切换事件
    // peopleJoin: 0,// 是否群众参与：0否 1是; repeatVote: 0,// 是否可重复投票：0否 1是; anonymous: 0,// 是否匿名：0否 1是 
    switchChange(type, value){
        const switchChangeVal:number = value ? 1 : 0;
        this.setState({
            [type]: switchChangeVal
        });
    }

    // 点击 下一步
    skipNextStep(){
        // 验证 
        // title: '',// 标题
        // content: '',// 内容
        // startTime: '', // 开始日期
        // endTime: '',// 截止日期
        // cover: '',// 封面
        // joinUser: [],// 参与人员
        // joinOrg: [],// 参与组织
        // voteNum: null,// 每人可投票数
        const { title, content, startTime, endTime, cover, joinUser, joinOrg, voteNum } = this.state;
        if (title ==='' || content ==='' || startTime ==='' || endTime ==='' || cover ==='' 
            || joinUser ===[] || joinOrg ===[] ||voteNum ===null) {
            Taro.showModal({
                title: '提示',
                content: '标题、内容、开始日期、截止日期、封面、参与人员、参与组织、可投票数必填哦~',
                showCancel: false
            })
            return
        }
        // 跳转
        Taro.navigateTo({
            url: '/subPackageEco/pages/vote/addVoteForm/index?data=' + JSON.stringify(this.state)
        })
    }

    render() {
        const { startTime, endTime, title, content, cover, peopleJoin, 
            joinUser, joinOrg, repeatVote, anonymous, voteNum,
            activityTitleActive, activityExplainActive} = this.state;
        return (
            <View className='activity-create'>
                <View className='activity-create-form'>
                    <View className={activityTitleActive ? 'activity-create-form-item-title-active' : 'activity-create-form-item-title'}>活动名称</View>
                    <AtTextarea
                        count={false}
                        value={title}
                        height='36'
                        onChange={this.titleAndContentChange.bind(this,'title')}
                        onFocus={this.titleAndContentFocusAndBlur.bind(this,'title')}
                        onBlur={this.titleAndContentFocusAndBlur.bind(this,'title')}
                        maxLength={50}
                        autoHeight={true}
                        placeholder='请输入活动名称'
                    />

                    <View className={activityExplainActive ? 'activity-create-form-item-title-active' : 'activity-create-form-item-title'}>活动说明</View>
                    <AtTextarea
                        count={false}
                        value={content}
                        height='36'
                        onChange={this.titleAndContentChange.bind(this,'content')}
                        onFocus={this.titleAndContentFocusAndBlur.bind(this,'content')}
                        onBlur={this.titleAndContentFocusAndBlur.bind(this,'content')}
                        maxLength={50}
                        autoHeight={true}
                        placeholder='请输入活动说明'
                    />

                    <View className='at-row activity-create-form-item'>
                        <View className='at-col at-col-5'>
                            <View>开始时间</View>
                            <View className='activity-create-form-item-date active'>
                                <Picker value={startTime} mode='date' onChange={this.selectDate.bind(this,'startTime')}>
                                    <View className={`picker ${startTime ? '' : 'gray'}`}>{startTime ? startTime : '请选择'}</View>
                                </Picker>
                            </View>
                        </View>
                        <View className='at-col at-col-2'>
                            <AtIcon prefixClass='icon icon-lujing' value='chevron-right' size='36' color='#ccc'></AtIcon>
                        </View>
                        <View className='at-col at-col-5'>
                            <View>结束时间</View>
                            <View className='activity-create-form-item-date active'>
                                <Picker value={endTime} mode='date' onChange={this.selectDate.bind(this,'endTime')} start={startTime}>
                                    <View className={`picker ${endTime ? '' : 'gray'}`}>{endTime ? endTime : '请选择'}</View>
                                </Picker>
                            </View>
                        </View>
                    </View>

                    <View className='at-row activity-create-form-item active' onClick={this.selectImage.bind(this)}>
                        <View className='at-col at-col-5' style='line-height: 90rpx;'>
                            <View>设置活动封面</View>
                        </View>
                        <View className='at-col at-col-6'>
                            {
                                cover ? 
                                <Dimage
                                    type='image'
                                    src={process.env.apiBackImgPre + cover}
                                    mode='aspectFill'
                                    styleValue='height: 90rpx; width: 190rpx; float: right; padding-right: 16rpx;' 
                                /> : <View className="mindView">请选择封面</View>
                                
                            }
                            
                        </View>
                        <View className='at-col at-col-1' style='line-height: 90rpx;'>
                            <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
                        </View>
                    </View>
                </View>

                <View className='activity-create-form'>
                    <View className='at-row activity-create-form-item active' onClick={this.selectOrg.bind(this)}>
                        <View className='at-col at-col-5'>
                            <View>参与组织</View>
                        </View>
                        <View className='at-col at-col-6'>
                            {
                                joinOrg.length > 0 ?
                                <View className='activity-create-form-item-content'>{joinOrg.length}个组织</View>
                                : <View className="miniMindView">请选择</View>
                            }
                        </View>
                        <View className='at-col at-col-1'>
                            <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
                        </View>
                    </View>
                    
                    <View className='at-row activity-create-form-item active' onClick={this.selectUser.bind(this)}>
                        <View className='at-col at-col-5'>
                            <View>参与人员</View>
                        </View>
                        <View className='at-col at-col-6'>
                            {
                                joinUser.length > 0 ? 
                                <View className='activity-create-form-item-content'>
                                    {
                                        joinUser.map((c_item,c_index)=>{
                                            return(
                                                ( c_item && c_index < 2 ) ? 
                                                <Dimage
                                                    type="image"
                                                    src={c_item.avatar}
                                                    mode='aspectFit'
                                                    styleValue='height: 52rpx; width: 52rpx; border-radius: 50%; vertical-align:middle; margin-right: 10rpx;'
                                                    
                                                /> : null
                                            )
                                        })
                                    }
                                    {joinUser.length > 2 ? '等' : ''}{joinUser.length}人
                                </View> : <View className="miniMindView">请选择</View>
                            }
                        </View>
                        <View className='at-col at-col-1'>
                            <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
                        </View>
                    </View>

                    <View className='at-row activity-create-form-item'>
                        <View className='at-col at-col-5' style='line-height: 64rpx;'>
                            <View>群众可参与</View>
                        </View>
                        <View className='at-col at-col-7 active'>
                            <AtSwitch border={false} color='#FF4D4F' checked={peopleJoin?true:false} onChange={this.switchChange.bind(this,'peopleJoin')}/>
                        </View>
                    </View>

                    <View className='at-row activity-create-form-item'>
                        <View className='at-col at-col-5' style='line-height: 64rpx;'>
                            <View>匿名参与</View>
                        </View>
                        <View className='at-col at-col-7 active'>
                            <AtSwitch border={false} color='#FF4D4F' checked={anonymous?true:false} onChange={this.switchChange.bind(this,'anonymous')}/>
                        </View>
                    </View>
                    
                    {/*  peopleJoin: 0,// 是否群众参与：0否 1是. ,
                    repeatVote: 0,// 是否可重复投票：0否 1是. ,
                    anonymous: 0,// 是否匿名：0否 1是. , */}
                    
                    <View className='at-row activity-create-form-item'>
                        <View className='at-col at-col-5' style='line-height: 64rpx;'>
                            <View>每人可投票数</View>
                        </View>
                        <View className='at-col at-col-7'>
                            <Input type='number' onInput={this.inputVoteNum.bind(this)} value={voteNum}
                                className='at-col-input' placeholder='请输入' maxLength={9}/>
                        </View>
                    </View>
                    
                    <View className='at-row activity-create-form-item'>
                        <View className='at-col at-col-5' style='line-height: 64rpx;'>
                            <View>重复投票</View>
                        </View>
                        <View className='at-col at-col-7 active'>
                            <AtSwitch border={false} color='#FF4D4F' checked={repeatVote?true:false} onChange={this.switchChange.bind(this,'repeatVote')}/>
                        </View>
                    </View>
                    

                    <View className='next-btn'>
                        <AtButton type='primary' onClick={this.skipNextStep.bind(this)}>下一步</AtButton>
                    </View>
                </View>
                
            </View>
        )
    }
}

export default Activity
