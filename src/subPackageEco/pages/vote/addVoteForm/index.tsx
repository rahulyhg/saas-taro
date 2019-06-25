import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { AddVoteFormProps, AddVoteFormState } from './index.interface'
import { debounce } from '../../../../utils/common'
import Dimage from '../../../../pages/common/dimage';
import DjLoading from '../../../../pages/common/djLoading';
import './index.scss'
import "../../../style/formRap.scss"
const remoteImgPreUrl = process.env.remoteImgPreUrl

// import {  } from '../../components'

// 上传的图片      // 用户输入的 标题       // 用户输入的 详情
@connect(({ addVoteForm, addVoteTypesForm }) => ({
    ...addVoteForm,
    ...addVoteTypesForm,
    index: addVoteTypesForm.index,
    cover: addVoteTypesForm.cover,
    title: addVoteTypesForm.title,
    remark: addVoteTypesForm.remark,
    isShowDeletBtn: addVoteTypesForm.remark.isShowDeletBtn,
    isDeleteEvt: addVoteTypesForm.isDeleteEvt, // 是否是删除返回回来的
}))
class AddVoteForm extends Component<AddVoteFormProps,AddVoteFormState > {
    config:Config = {
        navigationBarTitleText: '发布投票活动'
    }
    constructor(props: AddVoteFormProps) {
        super(props)
        this.state = {
            data: {},
            activityOption: [],
            atcAddIcon: remoteImgPreUrl + "images/subPackageEco/addxm.png",
            atcDeletIcon: remoteImgPreUrl + "images/subPackageEco/redDelet.png",
            isShowLoading: false,
        }
    }

    componentDidMount() {
        // 页面初始化
        const params = this.$router.params;
        this.setState({
            data: JSON.parse(params.data)
        })

        
    }

    componentDidShow() {
        const { isDeleteEvt } = this.props;
        const _list = {
            cover: this.props.cover,// 上传的图片
            title: this.props.title,// 用户输入的 标题
            remark: this.props.remark,// 用户输入的 详情
        }
        const index = this.props.index;
        let activityOption = this.props.activityOption || this.state.activityOption;
        
        // 将上一页返回的一组数据新增到列表
        if ( index == undefined && _list.title ) {
            activityOption = activityOption.concat([_list]);
            this.setState({ activityOption });
            // 删除上一页状态数据 
            this.saveDataToAddVoteTypesFormModel({
                cover: '',// 上传的图片
                title: '',// 用户输入的 标题
                remark: '',// 用户输入的 详情
            });
            // 将列表数据放入当前页的modal层中
            this.saveDataToAddVoteFormModel({
                activityOption
            });
        }
        // 如果 index 不为null，表示是从 编辑 跳回来的;
        if ( index >= 0 && _list.title ) {
            activityOption[index] = _list;
            this.setState({ activityOption });
            // 将列表数据放入当前页的modal层中
            this.saveDataToAddVoteFormModel({
                activityOption
            });
        }
        // 如果 isDeleteEvt == true 是点击 删除 跳回来的
        if ( isDeleteEvt ) {
            // 删除对应项
            this.deletAtcListItem(Number(this.props.index));
            // 更改上一页状态数据，改为非删除状态
            this.saveDataToAddVoteTypesFormModel({
                isDeleteEvt: false
            });
        }
        // 如果activityOption有值 写入页面 保证没发布之前，数据不要填写多次
        if (activityOption) {
            this.setState({
                activityOption
            });
        }
        

    }

    // 更新 addVoteTypesForm model 状态值
    saveDataToAddVoteTypesFormModel(param){
        const { dispatch } = this.props;
        dispatch({
            type: 'addVoteTypesForm/saveData',
            payload: param,
        });
    }

    // 更新当前页面 model 状态值
    saveDataToAddVoteFormModel(param){
        const { dispatch } = this.props;
        dispatch({
            type: 'addVoteForm/saveData',
            payload: param,
        });
    }

    // 点击已选项 进去编辑
    goEdit(item,index){
        const _pageParams = JSON.stringify(item);
        // 如果是跳去编辑的，对应表单页才显示删除按钮
        Taro.navigateTo({
            url: '/subPackageEco/pages/vote/addTypesForm/index?pageParams='+_pageParams+'&index='+index
        });
    }

    // 点击新增-跳转到新增表单页
    showAddTypeCover() {
        Taro.navigateTo({
            url: '/subPackageEco/pages/vote/addTypesForm/index'
        });
    }

    // 删除已添加项
    deletAtcListItem(index){
        let activityOption = this.state.activityOption;
        let _activityOption:any = [];
        activityOption.map((option_item, option_index)=>{
            if(option_index!==index){
                _activityOption.push(option_item)
            }
        })
        this.setState({ activityOption: _activityOption });
        // 将列表数据放入当前页的modal层中
        this.saveDataToAddVoteFormModel({
            activityOption
        });
    }

    // 预览图片
    preViewImage(index){
        console.log(index)
    }

    // 新增活动接口
    addActivityData = debounce(()=>{
        this.setState({
            isShowLoading: true
        });
        const { dispatch } = this.props;
        const prePageData = this.state.data;
        const _objdata = {
            title: prePageData.title,// (string, optional): 活动标题. ,
            activityOption: this.state.activityOption,// (Array[AddActivityOptionQo], optional): 投票选项 ,
            anonymous: prePageData.anonymous,// (string, optional): 是否匿名：0否 1是. ,
            content: prePageData.content,// (string, optional): 活动内容. ,
            cover: prePageData.cover,// (string, optional): 封面图片. ,
            startTime: prePageData.startTime,// (LocalDateTime, optional): 开始时间. ,
            endTime: prePageData.endTime,// (LocalDateTime, optional): 截止时间. ,
            // enterId: ,// (string, optional): 关联报名活动id. ,
            // id: ,// (string, optional): 投票活动id. ,
            joinOrg: prePageData.joinOrg,// (Array[JoinOrgDto], optional): 参与组织 ,
            joinUser: prePageData.joinUser,// (Array[JoinUserDTO], optional): 参与人 ,
            peopleJoin: prePageData.peopleJoin,// (string, optional): 是否群众参与：0否 1是. ,
            repeat: prePageData.repeat,// (string, optional): 是否可重复投票：0否 1是. ,
            voteNum: prePageData.voteNum,// (integer, optional): 每人每次可投票总数.
            launchOrg: prePageData.launchOrg, // 发布组织
            repeatVote: prePageData.repeatVote,// 是否可重复投票  0否 1是 
        }
        // 判断非空
        const { title, activityOption, content, startTime, endTime, cover, joinUser, joinOrg, voteNum } = _objdata;
        if (title ==='' || activityOption === [] || content ==='' || startTime ==='' || endTime ==='' || cover ==='' 
            || joinUser ===[] || joinOrg ===[] ||voteNum ===null) {
            Taro.showModal({
                title: '提示',
                content: '标题、内容、投票选项、开始日期、截止日期、封面、参与人员、参与组织、可投票数必填哦~',
                showCancel: false
            })
            return
        }
        dispatch({
            type: 'addVoteForm/addVote',
            payload: _objdata,
            callback: (res) => {
                this.setState({
                    isShowLoading: false
                });
                if(res.code==1){
                    Taro.showToast({
                        title: '操作成功',
                        icon: 'success',
                        duration: 2000
                    });
                    // 将当前页的modal层中列表数据清空
                    this.saveDataToAddVoteFormModel({
                        activityOption: []
                    });
                    // 返回上一页
                    // Taro.navigateBack({ delta: 2 });
                    Taro.switchTab({
                        url: '/pages/eco/home/index'
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
        
        // 删除上一页状态数据 
        this.saveDataToAddVoteTypesFormModel({
            cover: '',// 上传的图片
            title: '',// 用户输入的 标题
            remark: '',// 用户输入的 详情
        });

    }, 300)

    render() {
        const { data, activityOption, atcAddIcon, atcDeletIcon } = this.state;
        return (
        <View className='addVoteForm-wrap'>
            <View className="addTitleCom">
                <View className="card atcTitle">{data.title}</View>
            </View>
            {/* 自定义 list */}
            <View className="atcList">
                {
                    activityOption.map((item, index)=>{
                        return(
                            <View className="card atcListItem posrel" key={`atclist ${index}`} 
                                onClick={this.goEdit.bind(this,item,index)}>
                                <View className="atcDeletCom">
                                    <Dimage
                                        type="image"
                                        onClick={this.deletAtcListItem.bind(this,index)}
                                        src={atcDeletIcon} 
                                        mode="aspectFill" 
                                        styleValue='margin: 20rpx 20rpx 10rpx 30rpx; width: 34rpx; height: 34rpx;'
                                        />
                                </View>
                                {
                                    item.cover ?
                                    <View className="flex contentStart itemStart listPad">
                                        <View onClick={this.preViewImage.bind(this,index)}>
                                            <Dimage
                                                type="image"
                                                styleValue='width: 150rpx; height: 150rpx; margin-right: 50rpx; background-color: #f1f1f1;' 
                                                src={process.env.apiBackImgPre + item.cover} 
                                                mode="aspectFit"/>
                                        </View>
                                        <View className="listRightTxt">{item.title}</View>
                                    </View> : 
                                    <View className="flex contentStart listPad">{item.title}</View>
                                }
                            </View>
                        )
                    })
                }
                <View className="flex contentCenter active atcAddView" onClick={this.showAddTypeCover}>
                    <Dimage 
                        type="image"
                        styleValue="width: 32rpx; height: 32rpx; margin-right: 16rpx;" 
                        src={atcAddIcon} mode="aspectFill"/>
                    <Text className="atcAddTxt">点击添加投票选项</Text>
                </View>
            </View>
            
            {/* 发布按钮 */}
            <View className="pageBotBtnComSpace"></View>
            <View className="pageBotBtnCom">
                {
                    activityOption.length > 0 ?
                    <View className='pageBotBtn active' onClick={this.addActivityData.bind(this)}>发布活动</View>
                    :
                    <View className='pageBotBtn disableBtn'>发布活动</View>
                }
            </View>
            {/* 党建loading */}
            <DjLoading isshow={this.state.isShowLoading}/>
        </View>
        )
    }
}

export default AddVoteForm
