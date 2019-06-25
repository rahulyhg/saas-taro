import Taro, { Component, Config } from '@tarojs/taro'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { View, Text, Image, Swiper, SwiperItem, ScrollView, Block, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import { IndexProps, IndexState } from './index.interface';
import DjLoading from '@/src/pages/common/djLoading';
import "./index.scss"
import "taro-ui/dist/style/components/tabs.scss"
import Nodata from '@/src/pages/common/nodata';
import { url } from 'inspector';
// import Loading from '../../common/loading';
const remoteImgPreUrl = process.env.remoteImgPreUrl;
const apiBackImgPre = process.env.apiBackImgPre;
// Taro素材的引入方式 
const onepx =  remoteImgPreUrl + "images/news/onepx.png";
const playIcon = remoteImgPreUrl + "images/news/playIcon.png";
// const spectIcon = remoteImgPreUrl + "images/news/spectIcon.png";
const arrDown = remoteImgPreUrl + "images/news/arrDown.png";
const arrR = remoteImgPreUrl + "images/news/arrR.png";
const checkedIcon = remoteImgPreUrl + "images/news/checked.png";
const onePx = remoteImgPreUrl + "images/news/onePx.png";

@connect(({ news, portal }) => ({
    ...news,
    dictionary: portal.dictionary
}))

class News extends Component<IndexProps, IndexState> {
    config: Config = {
        navigationBarTitleText: 'AI党建云'
    }
    constructor(props: IndexProps) {
        super(props)
        this.state = {
            siteList: [],// 最大站点 列表
            siteListCurIndex: 0,// 最大站点 选择的序列  <**默认必须是第一个 即为 0**>
            tabs_temp: [], // tab中转数据，为了规避多次加载的问题
            tabs: [
                {
                    columnId: '',
                    title: '最新',
                    name: '最新',
                    swiperImgs: [],
                    lists: []
                },
                {
                    columnId: '',
                    title: '支部阵地',
                    name: '支部阵地',
                    swiperImgs: [],
                    lists: []
                },
            ],
            tabCurrent: 0, // 当前tab序列 
            // 站点对应的支部列表
            siteListChild: [],
            siteListChildIndex: 0,// 组织序列  <**默认必须是第一个 即为 0**>
            pageSize: 10,// 分页 条数
            current: 1, // 分页页码 默认从1开始
            loadmore: '',
            nodata: false,
            showCheckCover: false, // 弹层
            isShowLoading: false, // 党建loading
        }

    }

    componentDidMount() {
        // 视频开关
        const isOpen = this.props.dictionary.mini_live_broadcast.name.isOpen;
        this.setState({
            isOpen
		});
        // 最大站点和可选的党委列表
        this.findHomeSite();
    }

    // 最大站点和可选的党委列表 
    findHomeSite() {
        const { dispatch } = this.props;
        const _objdata  = { };
        this.setState({
            isShowLoading: true
        });

		// 查询
		dispatch({
            type: 'news/findHomeSite',
            payload: _objdata,
            callback: (res) => {
                this.setState({
                    isShowLoading: false
                });
                if(res.code==1){
                    const resSite = res.data;
                    const defaultSite = resSite.siteList;
                    let siteList = new Array(resSite.site);
                    siteList = siteList.concat(defaultSite);
                    // site 默认站点 ,
                    // siteList 可选站点列表
                    this.setState({
                        siteList
                    });
                    const { siteListCurIndex } = this.state;
                    // 获取支部征地 对应的支部列表
                    this.findBranchSite(siteList[siteListCurIndex].id);
                    // 获取 栏目 列表
                    this.findColumnList(siteList[siteListCurIndex].id);
                    
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

    // 根据党委站点的id查找 栏目 列表 
    findColumnList(_siteId) {
        const { dispatch } = this.props;
        const _objdata  = {
            siteId: _siteId
        };
        this.setState({
            isShowLoading: true
        });

		// 查询
		dispatch({
            type: 'news/findColumnList',
            payload: _objdata,
            callback: (res) => {
                this.setState({
                    isShowLoading: false
                });
                if(res.code==1){
                    let columnList = res.data;
                    let { tabs } = this.state;
                    columnList.map((item)=>{
                        item.title = item.name;
                    });
                    tabs = tabs.concat(columnList);
                    // 写入页面
                    this.setState({
                        tabs
                    }, ()=>{
                        // 查找幻灯的文章
                        this.findSlideArticle();
                        // 查询列表数据 
                        this.findArticleList(this.state.current);
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

    // 根据党委站点的id查找可选支部列表，以及默认支部
	findBranchSite(_siteId) {
        const { dispatch } = this.props;
        const _objdata  = {
            siteId: _siteId
        };
        this.setState({
            isShowLoading: true
        });

		// 查询
		dispatch({
            type: 'news/findBranchSite',
            payload: _objdata,
            callback: (res) => {
                this.setState({
                    isShowLoading: false
                });
                if(res.code==1){
                    let resData = res.data;
                    const defaultSite = resData.siteList;
                    let siteListChild = new Array(resData.site);
                    siteListChild = siteListChild.concat(defaultSite);
                    this.setState({
                        siteListChild
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
    
    // 查找幻灯的文章 列表
    findSlideArticle() {
        const { dispatch } = this.props;
        const { tabs, tabCurrent, siteList, siteListCurIndex } = this.state;

        let _type:number = 1;
        if (tabCurrent == 0) {
            _type = 1;
        } else if (tabCurrent == 1) {
            _type = 2;
        } else if (tabCurrent > 1) {
            _type = 3;
        } 

        const _objdata  = {
            siteId: siteList[siteListCurIndex].id,//	(required)站点id
            type: _type,// (required)查找类型（1：最新，2：支部阵地，3：其他栏目）
            columnId: tabs[tabCurrent].columnId,// 栏目id，type为3时 传
        };
        this.setState({
            isShowLoading: true
        });

		// 查询
		dispatch({
            type: 'news/findSlideArticle',
            payload: _objdata,
            callback: (res) => {
                this.setState({
                    isShowLoading: false
                });
                if(res.code==1){
                    let { tabs, tabCurrent } = this.state;
                    
                    tabs[tabCurrent].swiperImgs = res.data;
                    this.setState({
                        tabs
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
    
    // 获取 新闻 列表
    findArticleList(_current) {
        const { dispatch } = this.props;
        const { tabs, tabCurrent, siteList, siteListCurIndex, siteListChild, siteListChildIndex } = this.state;

        let _type:string = '1';
        if (tabCurrent == 0) {
            _type = '1';
        } else if (tabCurrent == 1) {
            _type = '2';
        } else if (tabCurrent > 1) {
            _type = '3';
        } 

        // 支部阵地的情况下，传支部id
        let _siteId = null;
        if (tabCurrent == 1) {
            _siteId = siteListChild[siteListChildIndex].id;
        } else {
            _siteId = siteList[siteListCurIndex].id;
        }

        const _objdata  = {
            siteId: _siteId,//	(required)站点id
            current: _current,//	(required)当前页数
            pageSize: this.state.pageSize,// (required)每页条数
            type: _type,// (required)查找类型（1：最新，2：支部阵地，3：其他栏目）
            columnId: tabs[tabCurrent].columnId,// 栏目id，type为3时 传
        };
        this.setState({
            isShowLoading: true
        });

		// 查询
		dispatch({
            type: 'news/findArticleList',
            payload: _objdata,
            callback: (res) => {
                this.setState({
                    isShowLoading: false
                });
                if(res.code==1){
                    const resData = res.data;
                    let { tabs, tabCurrent } = this.state;
                    let nodata = false;
                    let current = _current;
                    let loadmore = '';
                    if (_objdata.current == 1 && resData.length == 0) {
                        nodata = true;
                        current = _current;
                        loadmore = '';
                    } else if (resData.length < _objdata.pageSize) {
                        current = _current;
                        loadmore = '到底啦';
                    } else {
                        current = _current + 1;
                        loadmore = '加载更多';
                    }

                    let lists = tabs[tabCurrent].lists || [];
                    lists = lists.concat(resData);
                    tabs[tabCurrent].lists = lists;
                    this.setState({
                        tabs,
                        current,
                        nodata,
                        loadmore
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
    
    // 点击 show出 最大站点切换 层
    showCheckOrgCover = ()=>{
        this.setState({
            showCheckCover: !this.state.showCheckCover
        });
    }
    
    // 点击 关闭 最大站点切换 层 
    closeCheckType = ()=>{
        this.setState({
            showCheckCover: false
        });
    }

    // 切换 最大站点
    checkSite = (index)=>{
        if (this.state.siteListCurIndex == index) {
            return
        }
        // 写入页面
        this.setState({
            tabs: [
                {
                    columnId: '',
                    title: '最新',
                    name: '最新',
                    swiperImgs: [],
                    lists: []
                },
                {
                    columnId: '',
                    title: '支部阵地',
                    name: '支部阵地',
                    swiperImgs: [],
                    lists: []
                },
            ],
            current: 1, // 分页页码 默认从1开始
            loadmore: '',
            nodata: false,
            siteListCurIndex: index,
            showCheckCover: false,
        }, ()=>{
            // 如果在 支部阵地 tab下 重新获取子支部
            const { tabCurrent, siteList, siteListCurIndex } = this.state;
            if (tabCurrent == 1) {
                this.findBranchSite(siteList[siteListCurIndex].id);
            }
            // 获取栏目
            this.findColumnList(siteList[siteListCurIndex].id);
            
        });
    }

    // tabs change 事件
    handleTabsClick (value) {
        let { tabs, tabCurrent, siteList, siteListCurIndex } = this.state;
        tabs[tabCurrent].lists = [];
        tabs[tabCurrent].swiperImgs = [];
        this.setState({
            tabs,
            tabCurrent: value,
            current: 1, // 分页页码 默认从1开始
            loadmore: '',
            nodata: false,
            showCheckCover: false
        }, ()=>{
            if (value == 1) {
                this.findBranchSite(siteList[siteListCurIndex].id);
            }
            // 查找幻灯的文章 列表
            this.findSlideArticle();
            // 查询列表数据 
            this.findArticleList(this.state.current);

        });
        
    }

    // 切换 子支部 pickerChange
    changeOrgChild(e) {
        const siteListChildIndex = Number(e.detail.value);
        let { tabs, tabCurrent} = this.state;
        tabs[tabCurrent].lists = [];
        tabs[tabCurrent].swiperImgs = [];
        this.setState({
            tabs,
            current: 1, // 分页页码 默认从1开始
            loadmore: '',
            nodata: false,
            siteListChildIndex
        }, ()=>{
            // 查找幻灯的文章 列表
            this.findSlideArticle();
            // 查询列表数据 
            this.findArticleList(this.state.current);

        });
    }

    // 触底事件
    loadMoreEvt = ()=>{
        if (this.state.loadmore == '到底啦') {
            return
        }
        // 获取 新闻 列表
        this.findArticleList(this.state.current);
    }

    // 跳转到详情页 事件
    skipToDetail = (id)=>{
        Taro.navigateTo({
            url: '/pages/news/newsDetail/index?id=' + id
        });
    }

    render() {
        const { tabs, tabCurrent, siteList, siteListCurIndex, siteListChild, 
            siteListChildIndex, showCheckCover, loadmore, nodata, isOpen } = this.state;
        const styleBg = {backgroundImage: `url(${onePx})`};
        return (
            <View className='newsPage'>
                {/* 切换组织 */}
                <View className='flex contentEnd checkOrgArrDown' style={`background-image: url(${onepx})`}
                    onClick={this.showCheckOrgCover.bind(this)}>
                    <Image className='arrDown' src={arrDown} mode="aspectFill"/>
                </View>
                {
                    tabCurrent===1 ? 
                    <View className='zbPicker'>
                        <Picker range={siteListChild} mode='selector' rangeKey='name' onChange={this.changeOrgChild.bind(this)}>
                            <View className='flex active'>
                                <View className='flex contentStart'>
                                    <View className='nowZb'>当前支部</View>
                                    <View className='nowZbName'>{siteListChild[siteListChildIndex].name || '暂无支部'}</View>
                                </View>
                                <Image className='arrR' src={arrR} mode="aspectFill"/>
                            </View>
                        </Picker>
                    </View> : null
                }
                <AtTabs
                    current={tabCurrent}
                    scroll
                    tabList={tabs} 
                    onClick={this.handleTabsClick.bind(this)}>
                    {/* 内容项 循环 */}
                    {
                        tabs.map((item, index)=>{
                            return (
                                <AtTabsPane current={tabCurrent} index={tabCurrent} key={`swiper ${index}`}>
                                    <ScrollView className="tabsCom" scrollY scrollWithAnimation onScrollToLower={this.loadMoreEvt.bind(this)}>
                                        {
                                            tabCurrent===1 ? <View className='tabSpace'></View> : null
                                        }
                                        
                                        {/* 轮播图: cover封面图片url, id主键, title文章标题 */}
                                        {
                                            (item.swiperImgs && item.swiperImgs.length && isOpen == 1) ? 
                                            <Swiper
                                                className="newsSwiper"
                                                circular
                                                indicatorDots={false}
                                                autoplay={false}>
                                                {
                                                    item.swiperImgs.map((c_item,c_index)=>{
                                                        return (
                                                            <SwiperItem key={`c_swiper ${c_index}`} onClick={this.skipToDetail.bind(this, c_item.id)}>
                                                                <View className="newsSwiperView active">
                                                                    <Image className='news-s-img' src={apiBackImgPre + c_item.cover} mode="aspectFill"/>
                                                                    <View className='grayBgView' style={styleBg}></View>
                                                                    <View className='news-s-text'>{c_item.title}</View>
                                                                </View>
                                                            </SwiperItem>
                                                        )
                                                    })
                                                }
                                            </Swiper> : null
                                        }
                                        
                                        {/* 轮播图下面的 lists */}
                                        {
                                            (item.lists && item.lists.length > 0) ? item.lists.map((list_item, list_index) => {
                                                return (
                                                    <Block>
                                                        {
                                                            (list_item.isVideo == 1 && isOpen == 1) ?
                                                            <View className="sysLists active" key={`list ${list_index}`} onClick={this.skipToDetail.bind(this, list_item.id)}>
                                                                    <View className="sysListsTit">
                                                                    <Text>{list_item.title}</Text>
                                                                </View>
                                                                <View className="posrel">
                                                                    <Image className='one-spect-img' src={apiBackImgPre + list_item.cover} mode="aspectFill"/>
                                                                    <Image className='playIcon' src={playIcon} mode="aspectFill"/>
                                                                    {/* <Image className='spectIcon' src={spectIcon} mode="aspectFill"/> */}
                                                                </View>
                                                                <View className='size24 padT10'>
                                                                    <Text className='org site'>{list_item.siteName}</Text>
                                                                    <Text className='gray'>{list_item.visitCount} 阅读</Text>
                                                                </View>
                                                            </View> : null
                                                        }
                                                        {
                                                            (list_item.isVideo == 0 && list_item.imgList.length == 0) ?
                                                            <View className="sysLists active" key={`list ${list_index}`} onClick={this.skipToDetail.bind(this, list_item.id)}>
                                                                <View className="sysListsTit">
                                                                    <Text>{list_item.title}</Text>
                                                                </View>
                                                                <View className='size24'>
                                                                    <Text className='org site'>{list_item.siteName}</Text>
                                                                    <Text className='gray'>{list_item.visitCount} 阅读</Text>
                                                                </View>
                                                            </View> : null
                                                        }
                                                        {
                                                            (list_item.isVideo == 0 && list_item.imgList.length == 1) ?
                                                            <View className="sysLists active" key={`list ${list_index}`} onClick={this.skipToDetail.bind(this, list_item.id)}>
                                                                <View className="flex itemStart">
                                                                    <View>
                                                                        <View className="sysListsTit myWidth minHeight">
                                                                            <Text>{list_item.title}</Text>
                                                                        </View>
                                                                        <View className='size24'>
                                                                            <Text className='org site'>{list_item.siteName}</Text>
                                                                            <Text className='gray'>{list_item.visitCount} 阅读</Text>
                                                                        </View>
                                                                    </View>
                                                                    <Image className='one-col-img' src={apiBackImgPre + list_item.imgList[0].path} mode="aspectFill"/>
                                                                </View>
                                                            </View> : null
                                                        }
                                                        {
                                                            (list_item.isVideo == 0 && list_item.imgList.length == 2) ?
                                                            <View className="sysLists active" key={`list ${list_index}`} onClick={this.skipToDetail.bind(this, list_item.id)}>
                                                                <View className="sysListsTit">
                                                                    <Text>{list_item.title}</Text>
                                                                </View>
                                                                <View className="flex moreImg">
                                                                    <Image className='two-col-img-a' src={apiBackImgPre + list_item.imgList[0].path} mode="aspectFill"/>
                                                                    <Image className='two-col-img-b' src={apiBackImgPre + list_item.imgList[1].path} mode="aspectFill"/>
                                                                </View>
                                                                <View className='size24'>
                                                                    <Text className='org site'>{list_item.siteName}</Text>
                                                                    <Text className='gray'>{list_item.visitCount} 阅读</Text>
                                                                </View>
                                                            </View> : null
                                                        }
                                                        {
                                                            (list_item.isVideo == 0 && list_item.imgList.length >= 2) ?  
                                                            <View className="sysLists active" key={`list ${list_index}`} onClick={this.skipToDetail.bind(this, list_item.id)}>
                                                                <View className="sysListsTit">
                                                                    <Text>{list_item.title}</Text>
                                                                </View>
                                                                <View className="flex moreImg posrel">
                                                                    <Image className="two-col-img-c" src={apiBackImgPre + list_item.imgList[0].path} mode="aspectFill"/>
                                                                    <Image className="two-col-img-c" src={apiBackImgPre + list_item.imgList[1].path} mode="aspectFill"/>
                                                                    <Image className="two-col-img-c" src={apiBackImgPre + list_item.imgList[2].path} mode="aspectFill"/>
                                                                    {
                                                                        list_item.imgList.length == 2 ? 
                                                                        <View className="moreCover">
                                                                            <View className="grayCover"></View>
                                                                            <View className="txt">+{list_item.imgList.length-3}</View>
                                                                        </View> : null
                                                                    }
                                                                </View>
                                                                <View className='size24'>
                                                                    <Text className='org site'>{list_item.siteName}</Text>
                                                                    <Text className='gray'>{list_item.visitCount} 阅读</Text>
                                                                </View>
                                                            </View>: null
                                                        }
                                                    </Block>
                                                )
                                            }) : null
                                        }
                                        <Nodata show={nodata} notice='暂无数据' />
                                        <View className='loadmore'>{loadmore}</View>
                                    </ScrollView>
                                </AtTabsPane>
                            )
                        })
                    }
                </AtTabs>
                {/* djLoading */}
                <DjLoading isshow={this.state.isShowLoading} />
                {
                    showCheckCover ?
                    <Block>
                        <View className="optBg" onClick={this.closeCheckType.bind(this)}></View>
                        {
                            siteList.length === 0 ? 
                            <View className="orgList noOrg" onClick={this.closeCheckType.bind(this)}>暂无组织</View> :
                            <View className="orgList flex contentStart itemStart flexWrap">
                                {
                                    siteList.map((_item,_index)=>{
                                        return (
                                            <View className="orgBlock" key={`siteList ${_index}`} onClick={(e)=>{ 
                                                e.stopPropagation(); // 阻止事件冒泡
                                                this.checkSite(_index); 
                                                }}>
                                                <View className={`ellOneLine checkBlock ${siteListCurIndex==_index?'v-checked':'v-check'}`}>
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
            </View>
        )
    }
}

export default News
