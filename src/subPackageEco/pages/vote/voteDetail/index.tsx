import Taro, { Component, Config } from '@tarojs/taro';
import { View, Text, Block, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import { VoteDetailProps, VoteDetailState } from './index.interface';
import Dimage from '../../../../pages/common/dimage';
import Nodata from '../../../../pages/common/nodata';
import DjLoading from '../../../../pages/common/djLoading';

import './index.scss';
import "../../../style/formRap.scss";
const shareImageUrl = process.env.remoteImgPreUrl + 'images/common/shareDefaultImg.png';
const lineClose = process.env.remoteImgPreUrl + 'images/subPackageWork/lineClose.png';

@connect(({ voteDetail }) => ({
    ...voteDetail,
}))

class VoteDetail extends Component<VoteDetailProps, VoteDetailState> {
    config: Config = {
        navigationBarTitleText: '投票详情'
    }
    constructor(props: VoteDetailProps) {
        super(props)
        this.state = {
            showCover: false,
            activityId: '',//活动id
            rtnData: {
                activityVoteOptionDetailDTOList: []
            },
            voteMoreDetail: {
                activityVoteInDTOList: []
            },
            isShowLoading: true, // 默认显示
        }
    }

    componentDidMount() {
        const params = this.$router.params;// 页面参数
        this.setState({
            activityId: params.activityId
        }, ()=>{
            this.voteEditDetail(this.state.activityId, null);
        });
    }

    // 查询 投票详情
    voteEditDetail(_activityId, callbackFun){
        this.setState({
            isShowLoading: true
        });
        const { dispatch } = this.props;
        const _objdata = {
            activityId: _activityId
        }
        dispatch({
            type: 'voteDetail/voteDetail',
            payload: _objdata,
            callback: (res) => {
                this.setState({
                    isShowLoading: false
                });
                if (res.code==1){
                    const rtnData = res.data;
                    this.setState({
                        rtnData
                    });
                    // 如果 _index > -1 更新数据
                    if (callbackFun) {
                        callbackFun(rtnData);
                    }
                    
                } else {
                    Taro.showModal({
                        title: '提示',
                        content: res.msg||'服务器开小差啦',
                        showCancel: false,
                    });
                }
            }
        });
    }

    // 点击关闭弹层
    closePopup(){
        this.setState({
            showCover: false
        });
    }

    // 点击 投票 按钮
    addVoteNum(_index, e){
        e.stopPropagation();// 阻止冒泡
        this.setState({
            isShowLoading: true
        });
        const { dispatch } = this.props;
        let { rtnData, activityId } = this.state;
        const _optionId = rtnData.activityVoteOptionDetailDTOList[_index].optionId;
        
        const _objdata = {
            activityId: activityId,
            optionId: _optionId
        }
        dispatch({
            type: 'voteDetail/goVote',
            payload: _objdata,
            callback: (res) => {
                this.setState({
                    isShowLoading: false
                });
                if ( res.code==1) {
                    // upTotalNumState 真：没有超过总票额   假：已超过总票额
                    // isVote 真：没有超过某项票额   假：已超过某项票额
                    if(res.data.upTotalNumState && res.data.isVote){
                        Taro.showToast({
                            title: '操作成功',
                            icon: 'success',
                            duration: 2000
                        });
                    }else{
                        if ( !res.data.upTotalNumState ) {
                            Taro.showToast({
                                title: '您已超过投票总票额',
                                icon: 'none',
                                duration: 2000
                            });
                        } else if(!res.data.isVote) {
                            Taro.showToast({
                                title: '该项票额已用完，请投其他',
                                icon: 'none',
                                duration: 2000
                            });
                        }
                    }
                    // 更新 列表数据 
                    this.voteEditDetail(this.state.activityId, (res)=>{
                        rtnData.activityVoteOptionDetailDTOList[_index] = res.activityVoteOptionDetailDTOList[_index];
                        this.setState({
                            rtnData
                        });
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

    // 点击 查看 某一投票项 详情
    voteMoreDetail(optionId){
        // 如果是匿名投票，不要弹窗了 ;  anonymous 是否匿名：0否 1是.
        if(this.state.rtnData.anonymous == 1) {
            return
        }

        this.setState({
            isShowLoading: true
        });
        const { dispatch } = this.props;
        const _objdata = {
            optionId: optionId
        }
        dispatch({
            type: 'voteDetail/voteMoreDetail',
            payload: _objdata,
            callback: (res) => {
                this.setState({
                    isShowLoading: false
                });
                if(res.code==1){
                    // 写到页面
                    const voteMoreDetail = res.data;
                    this.setState({
                        voteMoreDetail,
                        showCover: true,
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
    
    // 页面分享事件
    onShareAppMessage() {
        const { activityId, rtnData } = this.state;
        shareImageUrl
        return {
            title: '【党建】' + rtnData.title,
            path: '/subPackageEco/pages/vote/voteDetail/index?activityId=' + activityId,
            imageUrl: shareImageUrl
        }
    }

    render() {
        const { rtnData, showCover, voteMoreDetail } = this.state;
        return (
            <View className='voteDetail-wrap'>
                {/* canVote 1有权限， 0 无权限 */}
                {
                    rtnData.canVote == 0?
                    <View className='noAuthority'>
                        <Nodata show={true} notice='对不起，您暂无此投票活动的权限' />
                    </View> : 
                    <Block>
                        {/* 标题 */}
                        <View className='head'>
                            <View className='title'>{rtnData.title}</View>
                            <View className='user flex'>
                                <View className="flex contentStart">
                                    <Dimage
                                        type='avatar'
                                        src={process.env.apiBackImgPre + rtnData.createCover}
                                        mode='aspectFill'
                                        styleValue='height: 64rpx; width: 64rpx; float: right; border-radius: 50%;'/>
                                    {/* <Text>发起投票者</Text> */}
                                    <Text className='user-name'>{rtnData.createName}</Text>
                                </View>
                                <View className='info'>{rtnData.startTime} ~ {rtnData.endTime}</View>
                            </View>
                            
                        </View>
                        {/* 列表  anonymous 是否匿名：0否 1是.*/}
                        <View className='list'>
                            {
                                rtnData.activityVoteOptionDetailDTOList.map((item, index)=>{
                                    return(
                                        item.cover ? 
                                        <View className={`list-item van-hairline--bottom ${rtnData.anonymous == 0?'active':''}`} key={`DTO${index}`} 
                                            onClick={this.voteMoreDetail.bind(this, item.optionId)}>
                                            <View className='list-item--container at-row'>
                                                <View>
                                                    <Dimage
                                                        type='avatar'
                                                        src={process.env.apiBackImgPre + item.cover}
                                                        mode='aspectFill'
                                                        styleValue='height: 180rpx; width: 180rpx; padding-right: 36rpx;'/>
                                                </View>
                                                <View className='at-col'>
                                                    <View className='title'>{item.title}</View>
                                                    <View className='info'>{item.remark}</View>
                                                    <View className='action at-row'>
                                                        <View className='at-col'>
                                                            <Text>{item.totalNum}</Text>票 | 已投<Text>{item.numMyself}</Text>票
                                                        </View>
                                                        <View className='btn active' onClick={this.addVoteNum.bind(this, index)}>投票</View>
                                                    </View>
                                                </View>
                                            </View>
                                            <View className='user-list at-row'>
                                                <View className='at-col'>
                                                    <View className='img-list'>
                                                        {
                                                            //  anonymous (string, optional): 是否匿名：0否 1是. 
                                                            item.activityVoteInDTOList.length > 0 && rtnData.anonymous == 0 ?
                                                            item.activityVoteInDTOList.map((c_item, c_index)=>{
                                                                return (
                                                                    c_index < 3 ? 
                                                                    <View className='img-item' key={`InDTO${index}`}>
                                                                        <Dimage
                                                                            type='image'
                                                                            src={process.env.apiBackImgPre + c_item.cover}
                                                                            mode='aspectFill'
                                                                            styleValue='height: 64rpx; width: 64rpx; margin-right: 16rpx; border-radius: 50%;'/>
                                                                    </View> : null
                                                                )
                                                            }) : null
                                                        }
                                                        
                                                    </View>
                                                </View>
                                                <View className='info'>
                                                    {
                                                        item.activityVoteInDTOList.length == 0 ?
                                                        <View>暂无人投票</View> : 
                                                        <View>
                                                            {item.activityVoteInDTOList.length>3 ? <Text>等</Text>:null}{item.peopleNum}人已投票
                                                            {rtnData.anonymous == 0?'':' [匿名]'}
                                                        </View>
                                                    }
                                                </View>
                                            </View>
                                        </View> : 
                                        <View className={`list-item van-hairline--bottom ${rtnData.anonymous == 0?'active':''}`} key={`DTO${index}`} 
                                            onClick={this.voteMoreDetail.bind(this, item.optionId)}>
                                            <View className='list-item--container at-row'>
                                                <View className='at-col'>
                                                    <View className='title'>{item.title}</View>
                                                    <View className='info'>{item.remark || '未设置备注'}</View>
                                                    <View className='action at-row'>
                                                        <View className='at-col'>
                                                            <Text>{item.totalNum}</Text>票 | 已投<Text>{item.numMyself}</Text>票
                                                        </View>
                                                        <View className='btn active' onClick={ this.addVoteNum.bind(this, index) }>投票</View>
                                                    </View>
                                                </View>
                                            </View>

                                            <View className='user-list at-row'>
                                                <View className='at-col'>
                                                    <View className='img-list'>
                                                        {
                                                            item.activityVoteInDTOList.length > 0 ?
                                                            item.activityVoteInDTOList.map((c_item, c_index)=>{
                                                                return (
                                                                    c_index < 3 ? 
                                                                    <View className='img-item' key={`InDTO${index}`}>
                                                                        <Dimage
                                                                            type='image'
                                                                            src={process.env.apiBackImgPre + c_item.cover}
                                                                            mode='aspectFill'
                                                                            styleValue='height: 64rpx; width: 64rpx; margin-right: 16rpx; border-radius: 50%;'/>
                                                                    </View> : null
                                                                )
                                                            }) : null
                                                        }
                                                    </View>
                                                </View>
                                                <View className='info'>
                                                    {
                                                        item.activityVoteInDTOList.length == 0 ?
                                                        <View>暂无人投票</View> : 
                                                        <View>
                                                            {item.activityVoteInDTOList.length>3 ? <Text>等</Text>:null}{item.peopleNum}人已投票
                                                            {rtnData.anonymous == 0?'':' [匿名]'}
                                                        </View>
                                                    }
                                                </View>
                                            </View>
                                        </View>
                            
                                    )
                                })
                            }
                            
                        </View>
                    </Block>
                }
                
                {/* model层 */}
                <View className={`${ showCover ? 'sysShow' : 'sysHide' }`}>
                    <View className="opacityCover"></View>
                    {/* <View className='close'>
                        <View className='icon icon-shanchu' onClick={this.closePopup.bind(this)}></View>
                    </View> */}
                    <View className="popup active" onClick={this.closePopup.bind(this)}>
                        <Image className='lineClose' src={lineClose} />
                        <View className='popupcom'>
                            <View className='title'>{voteMoreDetail.title}</View>
                            <View className='info'>{voteMoreDetail.remark || '未设置备注'}</View>
                            <View className='users flex contentStart flexWrap'>
                                {
                                    voteMoreDetail.activityVoteInDTOList.length > 0 ? 
                                    voteMoreDetail.activityVoteInDTOList.map((c_item)=>{
                                        return (
                                            <View className="usersCol">
                                                <Dimage
                                                    type='avatar'
                                                    src={process.env.apiBackImgPre + c_item.cover}
                                                    mode='aspectFill'
                                                    styleValue='height: 72rpx; width: 72rpx; border-radius: 50%;'/>
                                                    <View className="personName ellOneLine">{c_item.personName}</View>
                                            </View> 
                                        )
                                    }) : 
                                    <View style="width: 100%;">
                                        <Nodata show={true} notice='暂无数据' imgStyle='margin-top: 30px;' />
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                </View>

                <DjLoading isshow={this.state.isShowLoading} />

            </View>
        )
    }
}

export default VoteDetail
