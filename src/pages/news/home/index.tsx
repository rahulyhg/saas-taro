import Taro, { Component, Config } from '@tarojs/taro'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { View, Text, Image, Swiper, SwiperItem, ScrollView, Block } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import Api from '../../../utils/request'
// import Tips from '../../utils/tips'
import { IndexProps, IndexState } from './index.interface'
import "./index.scss"
import "taro-ui/dist/style/components/tabs.scss"
const remoteImgPreUrl = process.env.remoteImgPreUrl;
// Taro素材的引入方式 
const opacityBg =  remoteImgPreUrl + "images/news/opcityBg.png";

@connect(({ newsIndex }) => ({
    ...newsIndex,
}))

class NewsIndex extends Component<IndexProps, IndexState> {
    config: Config = {
        navigationBarTitleText: 'AI党建云'
    }
    constructor(props: IndexProps) {
        super(props)
        this.state = {
            current: 0,
            tabs: [
                {
                    title: '第1个tab',
                    swiperImgs: [
                        { title: '我是标题1我是标题1我是标题1',
                            imgsrc: 'https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64'},
                        { title: '我是标题1我是标题1我是标题1',
                            imgsrc: 'https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64'},
                        { title: '我是标题1我是标题1我是标题1',
                            imgsrc: 'https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64'},
                    ],
                    lists: [{imgLen: 0, isSpect: 1},{imgLen: 1, isSpect: 2},{imgLen: 2},{imgLen: 1},{imgLen: 4},{imgLen: 5}]
                },
                {
                    title: '第1个tab',
                    swiperImgs: [
                        { title: '我是标题1我是标题1我是标题1',
                            imgsrc: 'https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64'},
                        { title: '我是标题1我是标题1我是标题1',
                            imgsrc: 'https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64'},
                        { title: '我是标题1我是标题1我是标题1',
                            imgsrc: 'https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64'},
                    ],
                    lists: [
                        {},{},{},{},{},{},{},{}
                    ]
                },
                {
                    title: '第1个tab',
                    swiperImgs: [
                        { title: '我是标题1我是标题1我是标题1',
                            imgsrc: 'https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64'},
                        { title: '我是标题1我是标题1我是标题1',
                            imgsrc: 'https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64'},
                        { title: '我是标题1我是标题1我是标题1',
                            imgsrc: 'https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64'},
                    ],
                    lists: [
                        {},{},{},{},{},{},{},{}
                    ]
                },
                {
                    title: '第1个tab',
                    swiperImgs: [
                        { title: '我是标题1我是标题1我是标题1',
                            imgsrc: 'https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64'},
                        { title: '我是标题1我是标题1我是标题1',
                            imgsrc: 'https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64'},
                        { title: '我是标题1我是标题1我是标题1',
                            imgsrc: 'https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64'},
                    ],
                    lists: []
                },
                {
                    title: '第1个tab',
                    swiperImgs: [
                        { title: '我是标题1我是标题1我是标题1',
                            imgsrc: 'https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64'},
                        { title: '我是标题1我是标题1我是标题1',
                            imgsrc: 'https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64'},
                        { title: '我是标题1我是标题1我是标题1',
                            imgsrc: 'https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64'},
                    ],
                    lists: [
                        {},{},{},{},{},{},{},{}
                    ]
                }

            ],
            noDataImg: remoteImgPreUrl + "images/empty.png",
            demoImg: "https://wx.qlogo.cn/mmhead/306ZrwbE3v8XpbJusprk7kBkmcpEBwMF1Tlf34Gkp84/64",
			playIcon: remoteImgPreUrl + "images/news/playIcon.png",
            spectIcon: remoteImgPreUrl + "images/news/spectIcon.png",
            pickerLogo: remoteImgPreUrl + "images/news/pickerLogo.png",
            arrDown: remoteImgPreUrl + "images/news/arrDown.png",
            checkedIcon: remoteImgPreUrl + "images/news/checked.png",

            // 组织列表
            orgList: [
                { name: '扬州浩鲸科技支部-1' }, { name: '扬州浩鲸科技支部-2' }, { name: '扬州浩鲸科技支部-3' },
            ],
            orgListCurIndex: 0,// 选择的序列
            showCheckCover: false,// 
        }

    }

    handleClick (value) {
        this.setState({
            current: value
        });
    }

    // 获取今日数据
    async getData(month: number, day: number) {
        await this.props.dispatch({
            type: 'newsIndex/getLists',
            payload: {
                month: month,
                day: day
            }
        })
    }

    componentDidMount() {
    }

    // 点击下来 切换类别层
    openCheckType = ()=>{
        this.setState({
            showCheckCover: true
        });
    }

    // 切换类别
    checkType = (index)=>{
        console.log("***********",index)
        this.setState({
            orgListCurIndex: index,
            showCheckCover: false
        });
    }

    // 关闭切换 类别的层
    closeCheckType = ()=>{
        this.setState({
            showCheckCover: false
        });
    }

    // 触底事件
    loadMoreEvt = ()=>{
        console.log("loadMoreEvt")
    }

    // 跳转事件
    skipTest = ()=>{
        
        
    }

    render() {
        const { tabs, noDataImg, current, pickerLogo, arrDown, 
            orgList, orgListCurIndex, checkedIcon, showCheckCover } = this.state
        // const { data } = this.props
        return (
            <View className='newsPage'>
                <AtTabs
                    current={current}
                    scroll
                    tabList={tabs} onClick={this.handleClick.bind(this)}>
                    {/* 内容项 循环 */}
                    {
                        tabs.map((item, index)=>{
                            return (
                                <AtTabsPane current={current} index={current} key={`swiper ${index}`}>
                                    <ScrollView className="tabsCom" scrollY scrollWithAnimation onScrollToLower={this.loadMoreEvt.bind(this)}>
                                        <View className={current===1?"tabSpace_big":"tabSpace"}></View>
                                        {/* 切换组织 */}
                                        {
                                            current===1?
                                            <View className="checkOrgCom" onClick={this.openCheckType.bind(this)}>
                                                <View className="flex contentStart">
                                                    <Image className='pickerLogo' src={pickerLogo} mode="aspectFill"/>
                                                    <View className='c_picker'>{orgList[orgListCurIndex].name}</View>
                                                    <Image className='arrDown' src={arrDown} mode="aspectFill"/>
                                                </View>
                                            </View> : 
                                            null
                                        }
                                        {
                                            current===1 && showCheckCover ?
                                            <Block>
                                                <View className="optBg" onClick={this.closeCheckType.bind(this)}></View>
                                                {
                                                    orgList.length === 0 ? 
                                                    <View className="orgList noOrg" onClick={this.closeCheckType.bind(this)}>暂无组织</View> :
                                                    <View className="orgList flex contentStart itemStart flexWrap">
                                                        {
                                                            orgList.map((_item,_index)=>{
                                                                return (
                                                                    <View className="orgBlock" onClick={(e)=>{ 
                                                                        e.stopPropagation(); // 阻止事件冒泡
                                                                        this.checkType(_index); 
                                                                        }}>
                                                                        <View className={`ellOneLine checkBlock ${orgListCurIndex==_index?'v-checked':'v-check'}`}>
                                                                            {_item.name}
                                                                            <Image className='checkedIcon' src={checkedIcon} mode="aspectFill"/>
                                                                        </View>
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                        
                                                    </View>
                                                    
                                                }
                                                
                                            </Block> : null
                                        }
                                        
                                        
                                        
                                        {/* 轮播图 */}
                                        <Swiper
                                            className="newsSwiper"
                                            circular
                                            indicatorDots={false}
                                            autoplay={false}>
                                            {
                                                item.swiperImgs.map((c_item,c_index)=>{
                                                    return (
                                                        <SwiperItem key={`c_swiper ${c_index}`}>
                                                            <View className="newsSwiperView active">
                                                                <Image className='news-s-img' src={c_item.imgsrc} mode="aspectFill"/>
                                                                <Image className='news-s-bg-img' src={opacityBg} mode="aspectFill"/>
                                                                <View className='news-s-text'>{c_item.title}</View>
                                                            </View>
                                                        </SwiperItem>
                                                    )
                                                })
                                            }
                                        </Swiper>
                                        {/* 轮播图下面的 lists */}
                                        {
                                            item.lists.map((list_item, list_index) => {
                                                // isSpect 是否是专题
                                                return (
                                                    list_item.isSpect === 1 || list_item.isSpect === 2 ?
													<View className="sysLists active" key={`list ${list_index}`} onClick={this.skipTest.bind(this)}>
														<View className="sysListsTit">
															<Text className="hotIcon">热</Text>
															<Text>我是专题我是专题我是专题我是专题我是专题我是专题我是专题我是专题</Text>
														</View>
														<View className="posrel">
															<Image className='one-spect-img' src={this.state.demoImg} mode="aspectFill"/>
															{
																list_item.isSpect === 1
																	? <Image className='playIcon' src={this.state.playIcon} mode="aspectFill"/>
																	: <Image className='spectIcon' src={this.state.spectIcon} mode="aspectFill"/>
															}
														</View>
														<View className='size24'>
															<Text className='org'>人民日报</Text>
															<Text className='gray readNum'>30阅读</Text>
														</View>
													</View> :
													list_item.imgLen === 1 ?
													<View className="sysLists active" key={`list ${list_index}`} onClick={this.skipTest.bind(this)}>
														<View className="flex itemStart">
															<View>
																<View className="sysListsTit myWidth minHeight">
																	<Text className="hotIcon">热</Text>
																	<Text>我是1张图</Text>
																</View>
																<View className='size24'>
																	<Text className='org'>人民日报</Text>
																	<Text className='gray readNum'>30阅读</Text>
																</View>
															</View>
															<Image className='one-col-img' src={this.state.demoImg} mode="aspectFill"/>
														</View>

													</View> :
													list_item.imgLen === 2 ?
														<View className="sysLists active" key={`list ${list_index}`} onClick={this.skipTest.bind(this)}>
															<View className="sysListsTit">
																<Text className="hotIcon">热</Text>
																<Text>我是2张图</Text>
															</View>
															<View className="flex moreImg">
																<Image className='two-col-img-a' src={this.state.demoImg} mode="aspectFill"/>
																<Image className='two-col-img-b' src={this.state.demoImg} mode="aspectFill"/>
															</View>
															<View className='size24'><Text className='org'>人民日报</Text><Text className='gray readNum'>30阅读</Text></View>
														</View> :
														<View className="sysLists active" key={`list ${list_index}`} onClick={this.skipTest.bind(this)}>
															<View className="sysListsTit">
																<Text className="hotIcon">热</Text>
																<Text>我是3张图我是3张图我是3张图我是3张图</Text>
															</View>
															<View className="flex moreImg posrel">
																<Image className="two-col-img-c" src={this.state.demoImg} mode="aspectFill"/>
																<Image className="two-col-img-c" src={this.state.demoImg} mode="aspectFill"/>
																<Image className="two-col-img-c" src={this.state.demoImg} mode="aspectFill"/>
																<View className="moreCover">
																	<View className="grayCover"></View>
																	<View className="txt">+2</View>
																</View>
															</View>
															<View className='size24'><Text className='org'>人民日报</Text><Text className='gray readNum'>30阅读</Text></View>
														</View>
                                                )

                                            })


                                        }
                                        {
                                            item.lists.length > 0
                                                ? 	<View className="loadmore">加载更多</View>
                                                :   <View className="nodata">
                                                    <Image className='nodata-img' src={noDataImg} mode="aspectFit"/>
                                                    <View className="nodata-txt">暂无数据</View>
                                                </View>
                                        }

                                    </ScrollView>
                                </AtTabsPane>
                            )
                        })
                    }

                </AtTabs>
            </View>
        )
    }
}

export default NewsIndex
