import Taro, { Component, Config } from '@tarojs/taro'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { View, ScrollView, Text, Image, Input, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
const remoteImgPreUrl = process.env.remoteImgPreUrl
import Loading from '../../../../pages/common/loading'
import Nodata from '../../../../pages/common/nodata'
// import { debounce } from '../../../../utils/common';
import { MeetManageListProps, MeetManageListState } from './index.interface'
const findImgUrl = remoteImgPreUrl + 'images/subPackageWork/find.png';
const arrDImgUrl = remoteImgPreUrl + 'images/subPackageWork/arrD.png';
const cameraUrl = remoteImgPreUrl + 'images/subPackageWork/camera.png';
const release = remoteImgPreUrl + 'images/subPackageWork/release.png';

import './index.scss'
import '../../../style/meet.scss'

@connect(({ meetManageList }) => ({
    ...meetManageList,
}))

class MeetManageList extends Component<MeetManageListProps,MeetManageListState > {
    config:Config = {
        navigationBarTitleText: '会议'
    }
    constructor(props: MeetManageListProps) {
        super(props)
        this.state = {
            inputMeetTit: '',// 输入的搜索内容
            meetTypeArray: [],
            meetTypeArrayIndex: -1,
            tabs: [
                { code: '001',title: '未开始', list: []},
                { code: '002',title: '未结束', list: []},
                { code: '003',title: '已结束', list: []},
            ],
            curIndex: 0, // tab序列号，从0开始
            current: 1,// 当前分页，从1开始
            pageSize: 10, // 每一个条数
            finished: false, // 如果没有数据了，finished设置true
            loading: true,
        }
    }

    componentDidMount() {
        const { inputMeetTit, meetTypeArray, meetTypeArrayIndex,current } = this.state;
        const _typeId = meetTypeArrayIndex === -1 ? '' : meetTypeArray[meetTypeArrayIndex].id;
        const _state = this.state.curIndex;
        this.getListForMgr(inputMeetTit, _state, _typeId, current);// 会议进度（状态） 0：未开始1：未结束2：已结束.
        this.getListMeetType();
        
    }

    // 查询 会议列表 接口
    getListForMgr(_name, _state, _typeId, _current){
        const { dispatch } = this.props;
        Taro.showLoading({
            mask: true,
            title: '加载中'
        });
        const _objdata  = {
			name: _name,// 会议名称
            state: _state,// 会议进度（状态） 0：未开始1：未结束2：已结束.
            typeId: _typeId,// 会议类型 类型 id
            current: _current,// 当前页数，从 1 开始
            pageSize: this.state.pageSize,// 每页条数
        }
        this.setState({
            loading: true
        })
		// 新增
		dispatch({
            type: 'meetManageList/getListForMgr',
            payload: _objdata,
            callback: (res) => {
                Taro.hideLoading();
                this.setState({
                    loading: false
                })
                if(res.code==1){
                    const rtnData = res.data.list;
                    const curIndex = this.state.curIndex;
                    let tabs = this.state.tabs;
                    tabs[curIndex].list = tabs[curIndex].list.concat(rtnData);
                    // 判断是否没有数据了
                    let finished = false;
                    if( rtnData.length < this.state.pageSize ){
                        finished = true;
                    }
                    this.setState({
                        tabs,
                        current: this.state.current + 1,
                        finished
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

    // 获取会议类型接口
    getListMeetType(){
        const { dispatch } = this.props;
        const _objdata  = { };
		// 新增
		dispatch({
            type: 'meetManageList/getListMeetType',
            payload: _objdata,
            callback: (res) => {
                Taro.hideLoading();
                if(res.code==1){
					this.setState({
						meetTypeArray: res.data
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

    // tab 点击切换事件
    tabClick(curIndex){
        this.state.tabs[curIndex].list = [];
        const tabs = this.state.tabs;
        this.setState({
            tabs,
            curIndex,
            current: 1,
            finished: false,
        }, ()=>{
            const { inputMeetTit, meetTypeArray, meetTypeArrayIndex,current } = this.state;
            const _typeId = meetTypeArrayIndex === -1 ? '' : meetTypeArray[meetTypeArrayIndex].id;
            this.getListForMgr(inputMeetTit, curIndex, _typeId, current);// 会议进度（状态） 0：未开始1：未结束2：已结束.
        });
    }

    // 输入监听
    inputMeetTit(e){
        console.log(e.detail.value);
        const inputMeetTit = e.detail.value;
        this.setState({
            inputMeetTit
        });
        
    }

    // 选择会议类型
    onMeetTypesChange(e){
        const meetTypeArrayIndex = e.detail.value;
        this.setState({
            meetTypeArrayIndex
        });
        const { inputMeetTit, meetTypeArray, current } = this.state;
        const _typeId = meetTypeArrayIndex === -1 ? '' : meetTypeArray[meetTypeArrayIndex].id;
        const _state = this.state.curIndex;// 状态与tab的序列号 一一对应
        this.getListForMgr(inputMeetTit, _state, _typeId, current);// 会议进度（状态） 0：未开始1：未结束2：已结束.
    }

    // 加载更多
    loadMoreEvt(){
        // 如果已经到底，不再加载
        if(this.state.finished) {
            return
        }
        const { inputMeetTit, meetTypeArray, meetTypeArrayIndex,current } = this.state;
        const _typeId = meetTypeArrayIndex === -1 ? '' : meetTypeArray[meetTypeArrayIndex].id;
        const _state = this.state.curIndex;// 状态与tab的序列号 一一对应
        this.getListForMgr(inputMeetTit, _state, _typeId, current);// 会议进度（状态） 0：未开始1：未结束2：已结束.
    }

    // 输入框的confirmEvt事件
    confirmEvt(){
        const { curIndex, tabs } = this.state;
        tabs[curIndex].list = [];
        this.setState({
            tabs,
            finished: false,
            current: 1
        }, ()=>{
            const { inputMeetTit, meetTypeArray, meetTypeArrayIndex, current } = this.state;
            const _typeId = meetTypeArrayIndex === -1 ? '' : meetTypeArray[meetTypeArrayIndex].id;
            const _state = this.state.curIndex;// 状态与tab的序列号 一一对应
            this.getListForMgr(inputMeetTit, _state, _typeId, current);// 会议进度（状态） 0：未开始1：未结束2：已结束.
        })
        
    }

    // 跳转到详情页
    skipToDetail(id){
        Taro.navigateTo({
            url: '/subPackageWork/pages/meeting/meetManageDetail/index?id=' + id
        });
    }

    // 点击 去 发布
    goRelease(){
        Taro.navigateTo({
            url: '/subPackageWork/pages/meeting/meetRelease/index'
        });
    }

    render() {
        const { meetTypeArray, meetTypeArrayIndex, curIndex, tabs, finished, loading } = this.state;
        return (
        <View className='meetManageList-wrap meetList'>
            {/* 搜索框 */}
            <View className='findView flex'>
                    <View className='flex contentStart findCom'>
                        <Image className='find' src={findImgUrl} />
                        <Input className='findInput' placeholder='输入会议主题' onConfirm={this.confirmEvt.bind(this)} 
                            onInput={this.inputMeetTit.bind(this)}/>
                    </View>
                    <View className='pickerCom'>
                        <Picker value={2} mode='selector' range={meetTypeArray} rangeKey='name' onChange={this.onMeetTypesChange.bind(this)}>
                            <View className='flex black'>
                                {
                                    meetTypeArrayIndex > -1 ? 
                                    meetTypeArray[meetTypeArrayIndex].name : 
                                    <Text className='gray'>会议类型</Text>
                                }
                                <Image className='arrD' src={arrDImgUrl} />
                            </View>
                        </Picker>
                    </View>
                </View>
            {/* tab内容 */}
            <AtTabs
                current={curIndex}
                scroll
                tabList={tabs} 
                onClick={this.tabClick.bind(this)}>
                {/* 内容项 循环 */}
                {
                    tabs.map((item, index)=>{
                        return (
                            <AtTabsPane current={curIndex} index={curIndex} key={`swiper ${index}`}>
                                    <ScrollView className='tabsCom' scrollY scrollWithAnimation onScrollToLower={this.loadMoreEvt.bind(this)}>
                                        <View style={{height: '180rpx'}}></View>
                                        <View className='listcom'>
                                            {
                                                item.list.map((list_item)=>{
                                                    return(
                                                        <View className='list active' onClick={this.skipToDetail.bind(this,list_item.id)}>
                                                            <View>
                                                                {
                                                                    list_item.meetingModality === '1'
                                                                    ? <Image className='cameraIcon' mode='aspectFill' src={cameraUrl}/>
                                                                    : null
                                                                }
                                                                <Text className='title'>{list_item.name}</Text>
                                                            </View>
                                                            <View className='flex subtit'>
                                                                <Text className='org size24'>{list_item.typeName}</Text>
                                                                <Text className='gray size24'>{list_item.startTime}</Text>
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                            }
                                            <Loading finished={item.list.length > 0 && finished} loading={loading} />
                                            <Nodata show={item.list.length <= 0 && !loading} notice='暂无数据' />
                                        </View>
                                    </ScrollView>
                                </AtTabsPane>
                        )
                    })
                }

            </AtTabs>
            {/* 发布按钮 */}
            <View className='release active' onClick={this.goRelease.bind(this)}>
                <Image className='re-img' src={release} mode='aspectFill'/>
                <View className='re-text'>发布</View>
            </View>
        </View>
        )
    }
}

export default MeetManageList
