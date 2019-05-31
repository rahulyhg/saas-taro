import Taro, { Component, Config } from '@tarojs/taro'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { View, ScrollView, Text, Image, Input, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import Tips from '../../utils/tips'
// const remoteImgPreUrl = process.env.remoteImgPreUrl
import { MeetManageListProps, MeetManageListState } from './index.interface'
const findImgUrl = process.env.remoteImgPreUrl + 'images/subPackageWork/find.png';
const arrDImgUrl = process.env.remoteImgPreUrl + 'images/subPackageWork/arrD.png';
const cameraUrl = process.env.remoteImgPreUrl + 'images/subPackageWork/camera.png';
const release = process.env.remoteImgPreUrl + 'images/subPackageWork/release.png';

import './index.scss'
import '../../../style/meet.scss'
// import {  } from '../../components'

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
            meetTypes: [],
            tabs: [
                { code: '001',title: '未开始', list: [{},{},{},{},{}]},
                { code: '002',title: '未结束', list: [{},{},{},{},{}]},
                { code: '003',title: '已结束', list: [{},{},{},{},{}]},
            ],
            current: 0,
            loadmore: '加载更多',
        }
    }

    componentDidMount() {
        
    }

    // tab 点击切换事件
    tabClick(current){
        this.setState({
            current
        });
    }

    // 输入监听
    inputMeetTit(e){
        console.log(e.detail.value);
    }

    // 选择会议类型
    onMeetTypesChange(e){
        console.log(e.detail.value);
    }

    loadMoreEvt(){
        console.log('加载更多事件');
        this.setState({
            loadmore: '加载中...'
        });
        setTimeout(()=>{
            this.setState({
                loadmore: '加载更多'
            });
        }, 1000)
    }

    // 点击 去 发布
    goRelease(){
        Taro.navigateTo({
            url: '/subPackageWork/pages/meeting/meetRelease/index'
        });
    }

    render() {
        const { meetTypes, current, tabs, loadmore } = this.state;
        return (
        <View className='meetManageList-wrap meetList'>
            {/* 搜索框 */}
            <View className='findView flex'>
                <View className='flex contentStart findCom'>
                    <Image className='find' src={findImgUrl} />
                    <Input className='findInput' placeholder='输入会议主题' onInput={this.inputMeetTit.bind(this)}/>
                </View>
                <View className='pickerCom'>
                    <Picker value={2} mode='selector' range={meetTypes} rangeKey='' onChange={this.onMeetTypesChange.bind(this)}>
                        <View className='flex'>
                            <Text>会议类型</Text><Image className='arrD' src={arrDImgUrl} />
                        </View>
                    </Picker>
                </View>
            </View>
            {/* tab内容 */}
            <AtTabs
                current={current}
                scroll
                tabList={tabs} 
                onClick={this.tabClick.bind(this)}>
                {/* 内容项 循环 */}
                {
                    tabs.map((item, index)=>{
                        return (
                            <AtTabsPane current={current} index={current} key={`swiper ${index}`}>
                                <ScrollView className='tabsCom' scrollY scrollWithAnimation onScrollToLower={this.loadMoreEvt.bind(this)}>
                                    <View style={{height: '200rpx'}}></View>
                                    <View className='listcom'>
                                        {
                                            item.list.map((list_item, list_index)=>{
                                                return(
                                                    <View className='list'>
                                                        <View>
                                                            <Image className='cameraIcon' mode='aspectFill' src={cameraUrl}/>
                                                            <Text className='title'>{list_item}{list_index}我是标题我是标题我是标题我是标题我是标题我是标题</Text>
                                                        </View>
                                                        <View className='flex subtit'>
                                                            <Text className='org size24'>中心组学习</Text>
                                                            <Text className='gray size24'>2019-5-22 09:33</Text>
                                                        </View>
                                                    </View>
                                                )
                                            })                                                
                                        }
                                        <View className='loadmore' onClick={this.loadMoreEvt.bind(this)}>{loadmore}</View>
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
