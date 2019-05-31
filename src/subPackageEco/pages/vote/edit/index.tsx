import Taro, { Component, Config } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtTextarea, AtButton, AtIcon } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { EditProps, EditState } from './index.interface'
import { debounce } from '../../../../utils/common'
import Dimage from '../../../../pages/common/dimage'
import './index.scss'

@connect(({ voteEdit, orgPopView, userPopView }) => ({
    ...voteEdit,
    joinOrg: orgPopView.checkedList,
    joinUser: userPopView.checkedList
}))

class VoteEdit extends Component<EditProps,EditState > {
    [x: string]: any;
    config:Config = {
        navigationBarTitleText: '投票编辑'
    }
    constructor(props: EditProps) {
        super(props)
        this.state = {
            title: '',
            content: '',
            startTime: '',
            endTime: '',
            cover: '',
            joinOrg: [],
            joinUser: [], 
            peopleJoin: 0, // 是否群众参与：0否 1是;
            repeatVote: 0, // 是否可重复投票：0否 1是;
            anonymous: 0, // 是否匿名：0否 1是;
            voteNum: 0,

            activityId: '',//前一个页面带过来的参数

            activityTitleActive: false,
            activityExplainActive: false,
        }
    }

    componentDidMount() {
        // 页面加载 => 将activityId存state中
        const params = this.$router.params;// 页面参数
        this.setState({
            activityId: params.activityId || '290782665528762368'
        }, ()=>{
            this.voteEditDetail(this.state.activityId);
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

    // 标题与内容Change事件
    titleAndContentChange (type, e) {
        const inputValue:string = e.detail.value;
        this.setState({
            [type]: inputValue
        });
    }

    // 标题与内容FocusAndBlur事件
    titleAndContentFocusAndBlur (type) {
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
            type: 'voteEdit/imageUpload',
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
                    });
                }
            }
        });
    }

    // 选择组织
    selectOrg(){
        // 0未开始 1进行中 2已结束 3已取消
        if ( this.state.state==2 ) {
            return
        }
        Taro.navigateTo({
            url: '/subPackageEco/pages/org/index'
        })
    }

    // 人员选择
    selectUser(){
        // 0未开始 1进行中 2已结束 3已取消
        if ( this.state.state==2 ) {
            return
        }
        Taro.navigateTo({
            url: '/subPackageEco/pages/user/index'
        })
    }

    // 选择时间change
    selectDate(type, e){
        // 'start' 开始日期； 'end'截止日期；
        const selectDateVal:string = e.detail.value;
        this.setState({
            [type]: selectDateVal
        });
        
    }
    // 查询 投票详情
    voteEditDetail(_activityId){
        Taro.showLoading({
            mask: true,
            title: '加载中'
        });
        const { dispatch } = this.props;
        const _objdata = {
            activityId: _activityId
        }
        dispatch({
            type: 'voteEdit/voteEditDetail',
            payload: _objdata,
            callback: (res) => {
                Taro.hideLoading();
                if(res.code==1){
                    const resFormData = res.data
                    this.setState({
                        state: resFormData.state,// (string, optional): 状态：0未开始 1进行中 2已结束 3已取消（3已取消 状态在详情页不可能出现）

                        title: resFormData.title,// (string, optional): 活动标题. ,
                        content: resFormData.content,// (string, optional): 活动内容. ,
                        startTime: resFormData.startTime,// (LocalDateTime, optional): 开始时间. ,
                        endTime: resFormData.endTime,// (LocalDateTime, optional): 截止时间. ,
                        cover: resFormData.cover,// (string, optional): 封面图片. ,
                        joinOrg: resFormData.orgDto,// (Array[JoinOrgDto], optional): 参与组织 ,
                        joinUser: resFormData.userDto,// (Array[JoinUserDTO], optional): 参与人 ,
                        peopleJoin: resFormData.peopleJoin,// (string, optional): 是否群众参与：0否 1是. ,
                        repeatVote: resFormData.repeatVote,// (string, optional): 是否可重复投票：0否 1是. ,
                        anonymous: resFormData.anonymous,// (string, optional): 是否匿名：0否 1是. ,
                        voteNum: resFormData.voteNum,// (integer, optional): 每人每次可投票总数.
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
    // 点击保存 实现编辑
    saveEditVote = debounce(()=>{
        Taro.showLoading({
            mask: true,
            title: '加载中'
        });
        const { dispatch } = this.props;
        const _objdata = {
            id: this.state.activityId,// (string, optional): 投票活动id. ,
            title: this.state.title,// (string, optional): 活动标题. ,
            content: this.state.content,// (string, optional): 活动内容. ,
            startTime: this.state.startTime,// (LocalDateTime, optional): 开始时间. ,
            endTime: this.state.endTime,// (LocalDateTime, optional): 截止时间. ,
            cover: this.state.cover,// (string, optional): 封面图片. ,
            joinOrg: this.state.joinOrg,// (Array[JoinOrgDto], optional): 参与组织 ,
            joinUser: this.state.joinUser,// (Array[JoinUserDTO], optional): 参与人 ,
            peopleJoin: this.state.peopleJoin,// (string, optional): 是否群众参与：0否 1是. ,
            repeatVote: this.state.repeatVote,// (string, optional): 是否可重复投票：0否 1是. ,
            anonymous: this.state.anonymous,// (string, optional): 是否匿名：0否 1是. ,
            voteNum: this.state.voteNum,// (integer, optional): 每人每次可投票总数.
        }
        // 判断非空
        const { title, content, startTime, endTime, cover, joinUser, joinOrg, voteNum } = _objdata;
        if (title ==='' || content ==='' || startTime ==='' || endTime ==='' || cover ==='' 
            || joinUser ===[] || joinOrg ===[] ||voteNum ===null) {
            Taro.showModal({
                title: '提示',
                content: '标题、内容、投票选项、开始日期、截止日期、封面、参与人员、参与组织、可投票数必填哦~',
                showCancel: false
            })
            return
        }
        dispatch({
            type: 'voteEdit/editVote',
            payload: _objdata,
            callback: (res) => {
                Taro.hideLoading();
                if(res.data){
                    Taro.showToast({
                        title: '操作成功',
                        icon: 'success',
                        duration: 2000
                    });
                    // 返回上一页
                    Taro.navigateBack({ delta: 1 });
                }else{
                    Taro.showModal({
                        title: '提示',
                        content: res.msg||'服务器开小差啦',
                        showCancel: false,
                    });
                }
            }
        });
    }, 300)

    deleteVote(){
        Taro.showLoading({
            mask: true,
            title: '加载中'
        });
        const { dispatch } = this.props;
        const _objdata = {
            id: this.state.activityId
        }
        dispatch({
            type: 'voteEdit/deleteVote',
            payload: _objdata,
            callback: (res) => {
                Taro.hideLoading();
                if(res.code==1){
                    Taro.showToast({
                        title: '操作成功',
                        icon: 'success',
                        duration: 2000
                    });
                    // 返回上一页
                    Taro.navigateBack({ delta: 1 });
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


    render() {
        const { state, startTime, endTime, title, content, cover, peopleJoin, 
            joinUser, joinOrg, repeatVote, anonymous, voteNum,
            activityTitleActive, activityExplainActive} = this.state;
            // 0 未开始【活动名称，活动说明，开始时间，结束时间，活动封面，参与组织，参与人员】可编辑 
            // 1 进行中【活动名称，活动说明，结束时间，活动封面，参与组织，参与人员】可编辑 
            // 2 已结束【活动名称，活动说明，活动封面】可编辑 

            // 0 未开始【无】不可编辑 
            // 1 进行中【开始时间】不可编辑 
            // 2 已结束【开始时间，结束时间，参与组织，参与人员】不可编辑 
        return (
            <View className='vote-edit'>
                <View className='vote-edit-form'>
                    <View className={activityTitleActive ? 'vote-edit-form-item-title-active' : 'vote-edit-form-item-title'}>活动名称</View>
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

                    <View className={activityExplainActive ? 'vote-edit-form-item-title-active' : 'vote-edit-form-item-title'}>活动说明</View>
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

                    <View className='at-row vote-edit-form-item'>
                        <View className='at-col at-col-5'>
                            <View>开始时间</View>
                            <View className='vote-edit-form-item-date'>
                                <Picker value={startTime} mode='date' onChange={this.selectDate.bind(this,'startTime')} disabled={state==1||state==2}>
                                    <View className={`picker ${startTime ? '' : 'gray'}`}>{startTime ? startTime : '请选择'}</View>
                                </Picker>
                            </View>
                        </View>
                        <View className='at-col at-col-2'>
                            <AtIcon prefixClass='icon icon-lujing' value='chevron-right' size='36' color='#ccc'></AtIcon>
                        </View>
                        <View className='at-col at-col-5'>
                            <View>结束时间</View>
                            <View className='vote-edit-form-item-date'>
                                <Picker value={endTime} mode='date' onChange={this.selectDate.bind(this,'endTime')} start={startTime} disabled={state==2}>
                                    <View className={`picker ${endTime ? '' : 'gray'}`}>{endTime ? endTime : '请选择'}</View>
                                </Picker>
                            </View>
                        </View>
                    </View>

                    <View className='at-row vote-edit-form-item active' onClick={this.selectImage.bind(this)}>
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

                <View className='vote-edit-form'>
                    <View className='at-row vote-edit-form-item active' onClick={this.selectOrg.bind(this)}>
                        <View className='at-col at-col-5'>
                            <View>参与组织</View>
                        </View>
                        <View className='at-col at-col-6'>
                            {
                                joinOrg.length > 0 ?
                                <View className='vote-edit-form-item-content'>{joinOrg.length}个组织</View>
                                : <View className="miniMindView">请选择</View>
                            }
                        </View>
                        <View className='at-col at-col-1'>
                            <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='12' color='#ccc'></AtIcon>
                        </View>
                    </View>

                    <View className='at-row vote-edit-form-item active' onClick={this.selectUser.bind(this)}>
                        <View className='at-col at-col-5'>
                            <View>参与人员</View>
                        </View>
                        <View className='at-col at-col-6'>
                            {
                                joinUser.length > 0 ? 
                                <View className='vote-edit-form-item-content'>
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

                    <View className='at-row vote-edit-form-item'>
                        <View className='at-col at-col-5' style='line-height: 64rpx;'>
                            <View>群众可参与</View>
                        </View>
                        <View className='at-col at-col-7 textR' style='line-height: 64rpx;'>{peopleJoin?'是':'否'}</View>
                    </View>

                    <View className='at-row vote-edit-form-item'>
                        <View className='at-col at-col-5' style='line-height: 64rpx;'>
                            <View>匿名参与</View>
                        </View>
                        <View className='at-col at-col-7 textR' style='line-height: 64rpx;'>{anonymous?'是':'否'}</View>
                    </View>
                    
                    {/*  peopleJoin: 0,// 是否群众参与：0否 1是. ,
                    repeatVote: 0,// 是否可重复投票：0否 1是. ,
                    anonymous: 0,// 是否匿名：0否 1是. , */}
                    
                    <View className='at-row vote-edit-form-item'>
                        <View className='at-col at-col-5' style='line-height: 64rpx;'>
                            <View>每人可投票数</View>
                        </View>
                        <View className='at-col at-col-7 textR' style='line-height: 64rpx;'>{voteNum}</View>
                    </View>
                    
                    <View className='at-row vote-edit-form-item'>
                        <View className='at-col at-col-5' style='line-height: 64rpx;'>
                            <View>重复投票</View>
                        </View>
                        <View className='at-col at-col-7 textR' style='line-height: 64rpx;'>{repeatVote?'是':'否'}</View>
                    </View>

                    <View className='vote-edit-form-btn'>
                        <AtButton type='primary' onClick={this.saveEditVote.bind(this)}>保存</AtButton>
                        
                        <AtButton type='secondary' className='vote-edit-form-btn-del' onClick={this.deleteVote.bind(this)}>删除</AtButton>
                    </View>
                </View>

                
            </View>
        )
    }
}

export default VoteEdit
