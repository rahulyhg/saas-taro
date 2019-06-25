import Taro, { Component, Config } from '@tarojs/taro'
import { Block, View, Text, ScrollView, Picker, Image, Input, Switch, Canvas } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtIcon, AtButton,  } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { RewardsPunishmentsListProps, RewardsPunishmentsListState } from './index.interface'
import Djimage from '@/src/pages/common/dimage'
import DjList from '@/src/pages/common/djList'

const remoteImgPreUrl = process.env.remoteImgPreUrl
const imgChecked = remoteImgPreUrl + 'images/checked.png'

import './index.scss'

@connect(({ rewardsPunishmentsList, loading }) => ({
    ...rewardsPunishmentsList,
    listLoading: loading.effects['rewardsPunishmentsList/getRewardsList'],
}))

class RewardsPunishmentsList extends Component<RewardsPunishmentsListProps, RewardsPunishmentsListState > {
    config:Config = {
        navigationBarTitleText: '奖惩',
        enablePullDownRefresh: false,
    }

    defaultProps:RewardsPunishmentsListProps = {
        tabList0: [],
        tabDatas0: [],
        tabList1: [],
        tabDatas1: [],
        tabData0ScrollTop: 0,
        tabData1ScrollTop: 0,
    }

    constructor(props: RewardsPunishmentsListProps) {
        super(props)
        this.state = {
            checkedOrgIndex: -1,
            checkedOrgId: '',
            checkedYear: '',
            checkedYearIndex: -1,
            tabs: [
                { 
                    type: 1,
                    title: '个人荣誉',
                    pageCurrent: 1,
                }, { 
                    type: 0,
                    title: '组织荣誉',
                    pageCurrent: 1,
                }
            ],
            current: 0,
            hideSearchTool: false,
        }
    }
    
    async componentDidMount() {
        const pages = Taro.getCurrentPages()

        await this.getYearList()
        await this.getOrgList()

        this.reloadList()
    }

    componentDidShow() {
    }

    /** 搜索框事件 开始 */
    getYearList = () => {
        const showCount = 7;
        const nowYear = new Date().getFullYear()
        let years:Array<number> = []
        for(let i = 0; i < showCount; i++) {
            years.push(nowYear - i) 
        }
        this.setState({
            years
        })
    }

    getOrgList = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'rewardsPunishmentsList/getOrgList',
            payload: {},
            callback: (res) => {
                if(res.code === 1) {
                    this.setState({
                        orgList: res.data
                    })
                }
            }
        })
    }

    onCheckedOrg = (index, e:Event) => {
        const { orgList } = this.state

        const checkedOrgId = index === -1 ? '' : orgList[index].id

        this.setState({
            checkedOrgIndex: index,
            checkedOrgId,
        })
    }

    onCheckedYear = (index, e:Event) => {
        const { years } = this.state
        const checkedYear = index === -1 || !years ? '' : years[index]

        this.setState({
            checkedYearIndex: index,
            checkedYear,
        })
    }

    onSearchReset = (e:Event) => {
        const { years, orgList, checkedOrgIndex, checkedYearIndex } = this.state

        const checkedOrgId = checkedOrgIndex === -1 ? '' : orgList[checkedOrgIndex].orgId
        const checkedYear = checkedYearIndex === -1 || !years ? '' : years[checkedYearIndex]

        this.setState({
            checkedOrgIndex: -1,
            checkedOrgId,
            checkedYearIndex: -1,
            checkedYear,
        })
    }

    onSearch = (e:Event) => {
        this.closeSearch()
        this.reloadList()
    }

    closeSearch = () => {
        this.setState({
            hideSearchTool: false
        })
    }
    /** 搜索框事件 结束 */

    reloadList = () => {
        const { dispatch } = this.props
        const { current, checkedOrgId, checkedYear, tabs } = this.state

        // 判断当前tab的loading状态，加载中的直接return
        if(tabs[current].loading) {
            return
        }
        let newTabs = tabs
        newTabs[current] = {
            ...newTabs[current],
            loading: true,
        }
        this.setState({
            tabs: newTabs 
        })

        dispatch({
            type: 'rewardsPunishmentsList/getRewardsList',
            payload: {
                type: newTabs[current].type,
                year: checkedYear,
                orgId: checkedOrgId,
                pageSize: 10,
                current: 1,
            },
            callback: (pageCurrent) => {
                newTabs[current].pageCurrent = pageCurrent
                newTabs[current].loading = false
                this.setState({
                    tabs: newTabs
                })
            }
        })
    }

    getNextList = (e) => {
        const { dispatch } = this.props
        const { current, checkedOrgId, checkedYear, tabs } = this.state
        
        // 判断当前tab的loading状态，加载中的直接return
        if(tabs[current].loading) {
            return
        }
        let newTabs = tabs
        newTabs[current] = {
            ...newTabs[current],
            loading: true,
        }
        this.setState({
            tabs: newTabs 
        })

        dispatch({
            type: 'rewardsPunishmentsList/getRewardsList',
            payload: {
                type: newTabs[current].type,
                year: checkedYear,
                orgId: checkedOrgId,
                pageSize: 10,
                current: newTabs[current].pageCurrent,
            },
            callback: (pageCurrent) => {
                newTabs[current].pageCurrent = pageCurrent
                newTabs[current].loading = false
                this.setState({
                    tabs: newTabs
                })
            }
        })
    }

    // tab 点击切换事件
    tabClick = (newTabCurrent) => {
        const { current, tabs } = this.state
        // 两次点击同一个tab则刷新该tab，否则就切换tab
        if(newTabCurrent === current) {
            this.reloadList()
        } else {
            this.setState({
                current: newTabCurrent
            }, () => {
                if(tabs[newTabCurrent].pageCurrent === 1) {
                    this.reloadList()
                }
            })
        }
    }
    
    onTabTool = (e:Event) => {
        const { hideSearchTool } = this.state;
        this.setState({
            hideSearchTool: !hideSearchTool
        })
    }

    onHrefToEdit = (e:Event) => {
        const { current, tabs } = this.state
        Taro.navigateTo({
            url: `/subPackageWork/pages/rewardsPunishments/edit/index?type=${tabs[current].type}`,
        })

    }

    onHrefToDetail = (id, e:Event) => {
        Taro.navigateTo({
            url: `/subPackageWork/pages/rewardsPunishments/detail/index?id=${id}`,
        })
    }

    onTabData0ScrollTop = (left, top) => {
        const { dispatch } = this.props
        dispatch({
            type: 'rewardsPunishmentsList/setTabData0Scroll',
            payload: top
        })
    }

    onTabData1ScrollTop = (left, top) => {
        const { dispatch } = this.props
        dispatch({
            type: 'rewardsPunishmentsList/setTabData1Scroll',
            payload: top
        })
    }

    render() {
        const { tabList0, tabDatas0, tabData0ScrollTop, tabList1, tabDatas1, tabData1ScrollTop } = this.props
        const { current, tabs, hideSearchTool, checkedOrgIndex, checkedYearIndex, orgList, years } = this.state;

        return (
        <View className='rewardsPunishmentsList'>
            <View className="float-btn">
                <View className='text' onClick={this.onHrefToEdit.bind(this)}>
                    <AtIcon prefixClass='icon icon-xinzeng' value='chevron-right' size='18' color='#FFF'/>
                    <View>新增</View>
                </View> 
            </View>
            <View className='tabTool' onClick={this.onTabTool.bind(this)}>
                <View>
                    <View className='text'>筛选</View>
                    <AtIcon prefixClass='icon icon-jiangchengshaixuan' value='chevron-right' size='14' color='#999999'/>
                </View>
            </View>
            {
                /** 搜索栏 */
                <View hidden={!hideSearchTool} className="searchTool">
                    <View>
                        <View className="searchItem">
                            <View className="title">组织</View>
                            <View className="formItems">
                                <View className={`formItem active ${checkedOrgIndex === -1 ? 'checked' : ''}`} onClick={this.onCheckedOrg.bind(this, -1)}>
                                    <View>全部</View>
                                    <Image src={checkedOrgIndex === -1 ? imgChecked : ''} />
                                </View>
                                {
                                    orgList && orgList.map((org, index) => {
                                        return (
                                            <View key={org.id} className={`formItem active ${checkedOrgIndex === index ? 'checked' : ''}`} onClick={this.onCheckedOrg.bind(this, index)}>
                                                <View>{org.name}</View>
                                                <Image src={checkedOrgIndex === index ? imgChecked : ''} />
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                        <View className="searchItem">
                            <View className="title">年份</View>
                            <View className="formItems">
                                <View className={`formItem w25 active ${checkedYearIndex === -1 ? 'checked' : ''}`} onClick={this.onCheckedYear.bind(this, -1)}>
                                    <View>全部</View>
                                    <Image src={checkedYearIndex === -1 ? imgChecked : ''} />
                                </View>
                                {
                                    years && years.map((year, index) => {
                                        return (
                                            <View key={year} className={`formItem w25 active ${checkedYearIndex === index ? 'checked' : ''}`} onClick={this.onCheckedYear.bind(this, index)}>
                                                <View>{year}</View>
                                                <Image src={checkedYearIndex === index ? imgChecked : ''} />
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                        <View className="btnTool">
                            <AtButton type='secondary' className='reset' onClick={this.onSearchReset.bind(this)}>重置</AtButton>
                            <AtButton type='primary' onClick={this.onSearch.bind(this)}>确定</AtButton>
                        </View>
                    </View>
                </View>
            }
            <AtTabs
                current={current}
                scroll
                tabList={tabs} 
                onClick={this.tabClick.bind(this)}>
                    {/* 个人荣誉 */}
                    <AtTabsPane current={current} index={0}>
                        <View className="tabNBSP"></View>
                        <ScrollView 
                            className='tab1'
                            scrollY
                            scrollWithAnimation
                            lowerThreshold={50}
                            onScrollToLower={this.getNextList.bind(this)}
                            scrollTop={tabData1ScrollTop}
                            onScroll={this.onTabData1ScrollTop.bind(this)}
                        >
                            <DjList
                                listName='tab1'
                                key='tab1'
                                loading={tabs[current].loading}
                                datas={tabDatas1}
                                pageTotal={(tabList1 || []).length}
                            >
                                {
                                    tabList1 && tabList1.map(tab => {
                                        return (
                                            <View key={tab.id} className='viewItem' onClick={this.onHrefToDetail.bind(this, tab.id)}>
                                                <View>
                                                    <Djimage src={`${process.env.apiBackImgPre}${tab.imgUrl}`}  onClick={this.onHrefToDetail.bind(this, tab.id)} />
                                                    <View>{tab.name}</View>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </DjList>
                        </ScrollView>
                    </AtTabsPane>
                    {/* 组织荣誉 */}
                    <AtTabsPane current={current} index={1}>
                        <View className="tabNBSP"></View>
                        <ScrollView 
                            className='tab2'
                            scrollY
                            scrollWithAnimation
                            lowerThreshold={50}
                            onScrollToLower={this.getNextList.bind(this)}
                            scrollTop={tabData0ScrollTop}
                            onScroll={this.onTabData0ScrollTop.bind(this)}
                        >
                            <DjList
                                key='tab2'
                                loading={tabs[current].loading}
                                datas={tabDatas0}
                                pageTotal={(tabList0 || []).length}
                            >
                                {
                                   tabList0 && tabList0.map(tab => {
                                        return (
                                            <View key={tab.id} className='viewItem' onClick={this.onHrefToDetail.bind(this, tab.id)}>
                                                <View>
                                                    <Djimage src={`${process.env.apiBackImgPre}${tab.imgUrl}`} onClick={this.onHrefToDetail.bind(this, tab.id)} />
                                                    <View>{tab.name}</View>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </DjList>
                        </ScrollView>
                    </AtTabsPane>
            </AtTabs>
        </View>
        )
    }
}

export default RewardsPunishmentsList
