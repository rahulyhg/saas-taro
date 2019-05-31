import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { VoteDetailProps, VoteDetailState } from './index.interface'
import Dimage from '../../../../pages/common/dimage'
import Nodata from '../../../../pages/common/nodata'
import './index.scss'
import "../../../style/formRap.scss"
const shareImageUrl = process.env.remoteImgPreUrl + 'images/common/shareDefaultImg.png';

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
            }
        }
    }

    componentDidMount() {
        const params = this.$router.params;// 页面参数
        this.setState({
            activityId: params.activityId || '290782665528762368'
        }, ()=>{
            this.voteEditDetail(this.state.activityId, null);
        });
        // Taro.setStorageSync('token',{
        //     avatarUrl: null,
        //     city: null,
        //     country: null,
        //     gender: 0,
        //     nickName: null,
        //     orgId: null,
        //     orgName: null,
        //     person_name: null,
        //     phone: null,
        //     province: null,
        //     sysUserId: null,
        //     token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIiLCJjcmVhdGVyIjoiZGpvc3MiLCJpc3MiOiJkanNhYX"+
        //         "MiLCJleHAiOjE1NTg0MDY3ODgsImlhdCI6MTU1ODQwMzE4OCwianRpIjoid29tZW5zaGlvc3Nvc3NuaXpo"+
        //         "aWRhb3NoaXNoZW5tZW1hIn0.TlEE5GubpklGDKsVfUpa7TOUvmnfGiKK6Q_H18DMEG0",
        //     type: 1}
        // );
    }

    // 查询 投票详情
    voteEditDetail(_activityId, callbackFun){
        Taro.showLoading({
            mask: true,
            title: '加载中'
        });
        const { dispatch } = this.props;
        const _objdata = {
            activityId: _activityId
        }
        dispatch({
            type: 'voteDetail/voteDetail',
            payload: _objdata,
            callback: (res) => {
                Taro.hideLoading();
                if(res.code==1){
                    const rtnData = res.data
                    this.setState({
                        rtnData
                    });
                    // 如果 _index > -1 更新数据
                    if (callbackFun) {
                        callbackFun(rtnData);
                    }
                    
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

    // 点击关闭弹层
    closePopup(){
        this.setState({
            showCover: false
        });
    }

    // 点击 投票 按钮
    addVoteNum(_index, e){
        e.stopPropagation();// 阻止冒泡
        Taro.showLoading({
            mask: true,
            title: '加载中'
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
                Taro.hideLoading();
                if(res.code==1){
                    Taro.showToast({
                        title: '操作成功',
                        icon: 'success',
                        duration: 2000
                    });
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
        Taro.showLoading({
            mask: true,
            title: '加载中'
        });
        const { dispatch } = this.props;
        const _objdata = {
            optionId: optionId
        }
        dispatch({
            type: 'voteDetail/voteMoreDetail',
            payload: _objdata,
            callback: (res) => {
                Taro.hideLoading();
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
                {/* 列表 */}
                <View className='list'>
                    {
                        rtnData.activityVoteOptionDetailDTOList.map((item, index)=>{
                            return(
                                item.cover ? 
                                <View className='list-item van-hairline--bottom active' key={`DTO${index}`} 
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
                                                <View className='btn' onClick={this.addVoteNum.bind(this, index)}>投票</View>
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
                                                <View>{item.activityVoteInDTOList.length>3 ? <Text>等</Text>:null}{item.peopleNum}人已投票</View>
                                                
                                            }
                                        </View>
                                    </View>
                                </View> : 
                                <View className='list-item van-hairline--bottom active' key={`DTO${index}`} 
                                    onClick={this.voteMoreDetail.bind(this, item.optionId)}>
                                    <View className='list-item--container at-row'>
                                        <View className='at-col'>
                                            <View className='title'>{item.title}</View>
                                            <View className='info'>{item.remark}</View>
                                            <View className='action at-row'>
                                                <View className='at-col'>
                                                    <Text>{item.totalNum}</Text>票 | 已投<Text>{item.numMyself}</Text>票
                                                </View>
                                                <View className='btn' onClick={ this.addVoteNum.bind(this, index) }>投票</View>
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
                                                <View>{item.activityVoteInDTOList.length>3 ? <Text>等</Text>:null}{item.peopleNum}人已投票</View>
                                            }
                                        </View>
                                    </View>
                                </View>
                
                    
                            )
                        })
                    }
                    
                </View>
                {/* model层 */}
                <View className={`${ showCover ? 'sysShow' : 'sysHide' }`}>
                    <View className="opacityCover"></View>
                    <View className='close'>
                        <View className='icon icon-shanchu' onClick={this.closePopup.bind(this)}></View>
                    </View>
                    <View className="popup">
                        <View className='title'>{voteMoreDetail.title}</View>
                        <View className='info'>{voteMoreDetail.remark}</View>
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
                                }) : <Nodata show={true} />
                            }
                        </View>


                    </View>
                </View>
            </View>
        )
    }
}

export default VoteDetail
