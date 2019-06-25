import Taro, { Component, Config } from "@tarojs/taro";
import { AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
// eslint-disable-next-line
import { IntegralRankProps, IntegralRankState } from "./index.interface";
import { connect } from '@tarojs/redux'
// import Tips from '../../utils/tips'
// const remoteImgPreUrl = process.env.remoteImgPreUrl
import { View, Text, Image, Picker, ScrollView } from "@tarojs/components";
import './index.scss'
import Dimage from "../../common/dimage";
// import {  } from '../../components'
import deepClone from 'lodash.clonedeep'

@connect(({ integral }) => ({
    ...integral,
}))

class IntegralRank extends Component<IntegralRankProps, IntegralRankState> {
    config: Config = {
        navigationBarTitleText: '积分排行榜'
    }
    constructor(props: IntegralRankProps) {
        super(props)
        this.state = {
            activeTab: 'year',
            current: 1,
            pageSize: 10,
            list: []
        }
    }

    async componentDidMount() {
        let nowDate = new Date();
        const nowYear = nowDate.getFullYear();
        const nowMonth = (nowDate.getMonth() + 1) > 10 ? (nowDate.getMonth() + 1) : '0' + (nowDate.getMonth() + 1);
        const startYear = '2018'
        let yearList: any = [];
        let monthList: any = [];
        let month: any = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        for (let i = Number(startYear); i <= Number(nowYear); i++) {
            yearList.push(i);
            if (i == Number(nowYear)) {
                const findIndex = month.indexOf(nowMonth);
                month.forEach((element, index) => {
                    if (index <= findIndex) {
                        monthList.push(i + "-" + element)
                    }
                })
            } else {
                month.forEach(element => {
                    monthList.push(i + "-" + element)
                })
            }

        }
        this.setState({
            yearList: yearList.reverse(),
            monthList: monthList.reverse(),
            itemList: yearList.reverse(),
            year: yearList.reverse()[0],
            loading: true,
            month: '0'
        }, async () => {
            const { year, month, current } = this.state;
            const { dispatch } = this.props;
            await dispatch({
                type: 'integral/queryAllPageListForOrg',
                payload: { year: year, month: month, current: current, pageSize: 10 }
            })
            const { orgRank } = this.props;
            this.setState({
                list: orgRank.list,
                finished: orgRank.list.length < 10 ? true : false,
                current: current + 1,
                loading: false
            })
        })
    }

    onChange = e => {
        const { activeTab, itemList } = this.state;
        if (activeTab == 'year') {
            this.setState({
                year: itemList[e.detail.value],
                current: 1,
                loading: true,
                month: '0'
            }, async () => {
                const { year, month, current } = this.state;
                const { dispatch } = this.props;
                await dispatch({
                    type: 'integral/queryAllPageListForOrg',
                    payload: { year: year, month: month,  current: current, pageSize: 10 }
                })
                const { orgRank } = this.props;
                this.setState({
                    list: orgRank.list,
                    finished: orgRank.list.length < 10 ? true : false,
                    current: current + 1,
                    loading: false
                })
            })
        } else {
            this.setState({
                year: itemList[e.detail.value].split('-')[0],
                month: itemList[e.detail.value].split('-')[1],
                current: 1,
                loading: true,
            }, async () => {
                const { year, month, current } = this.state;
                const { dispatch } = this.props;
                await dispatch({
                    type: 'integral/queryAllPageListForOrg',
                    payload: { year: year, month: month, current: current, pageSize: 10 }
                })
                const { orgRank } = this.props;
                this.setState({
                    list: orgRank.list,
                    finished: orgRank.list.length < 10 ? true : false,
                    current: current + 1,
                    loading: false
                })
            })
        }
    }

    changeTab = (activeTab, e) => {
        const { yearList, monthList } = this.state;
        let itemList: any = [];
        if (activeTab == 'year') {
            itemList = yearList;
        } else {
            itemList = monthList;
        }
        this.setState({
            activeTab: activeTab,
            itemList,
            year: activeTab == 'year' ? itemList[0] : itemList[0].split('-')[0],
            month: activeTab == 'year' ? '0' : itemList[0].split('-')[1],
            current: 1,
            loading: true,
            finished: false
        }, async () => {
            const { year, month, current } = this.state;
            const { dispatch } = this.props;
            await dispatch({
                type: 'integral/queryAllPageListForOrg',
                payload: { year: year, month: month, current: current, pageSize: 10 }
            })
            const { orgRank } = this.props;
            this.setState({
                list: orgRank.list,
                finished: orgRank.list.length < 10 ? true : false,
                current: current + 1,
                loading: false
            })
        })
    }

    renderList = () => {
        const { orgRank } = this.props;
        const { list } = this.state;
        let rankList: any = [];
        let firstPerson: any = {};
        let secondPerson: any = {};
        let thirdPerson: any = {};

        if (list && list.length > 0) {
            rankList = deepClone(list);
            firstPerson = orgRank.list[0];
            secondPerson = orgRank.list.length >= 2 ? orgRank.list[1] : {};
            thirdPerson = orgRank.list.length >= 3 ? orgRank.list[2] : {};
            const length = orgRank.list.length >= 3 ? 3 : (orgRank.list.length >= 2 ? 2 : 1);
            rankList.splice(0, length)
        }


        return <View className='list'>
            <View className='list-head van-hairline--bottom'>
                {<View className='rank-photo'>
                    <View className='at-row'>
                        {
                            secondPerson.objectName ? <View className='at-col'>
                                <Image className='rank-icon' src='http://saas-2-min-pro.oss-cn-hangzhou.aliyuncs.com/images/user/two.png' mode='aspectFit' />
                            </View> : <View className='at-col'></View>
                        }
                        {
                            firstPerson.objectName ? <View className='at-col first'>
                                <Image className='rank-icon' src='http://saas-2-min-pro.oss-cn-hangzhou.aliyuncs.com/images/user/one.png' mode='aspectFit' />
                            </View> : <View className='at-col'></View>
                        }
                        {
                            thirdPerson.objectName ? <View className='at-col'>
                                <Image className='rank-icon' src='http://saas-2-min-pro.oss-cn-hangzhou.aliyuncs.com/images/user/three.png' mode='aspectFit' />
                            </View> : <View className='at-col'></View>
                        }
                    </View>
                </View>}


                <View className='rank-user'>
                    <View className='at-row'>
                        {
                            secondPerson.objectName ? <View className='at-col'>
                                <View className='rank-user__name'>{secondPerson.objectName}</View>
                                <View className='rank-scroe'>{secondPerson.sumScore}</View>
                            </View> : <View className='at-col'></View>
                        }
                        {
                            firstPerson.objectName ? <View className='at-col'>
                                <View className='rank-user__name'>{firstPerson.objectName}</View>
                                <View className='rank-scroe'>{firstPerson.sumScore}</View>
                            </View> : <View className='at-col'></View>
                        }
                        {
                            thirdPerson.objectName ? <View className='at-col'>
                                <View className='rank-user__name'>{thirdPerson.objectName}</View>
                                <View className='rank-scroe'>{thirdPerson.sumScore}</View>
                            </View> : <View className='at-col'></View>
                        }
                    </View>
                </View>

            </View>
            {
                rankList && rankList.map(item => (
                    <View className='list-item  van-hairline--bottom'>
                        <View className='at-row'>
                            <Text className='rank'>{item.rank}</Text>
                            <Dimage src='' type='' />
                            <View>
                                <View className='user-name'>{item.objectName}</View>
                            </View>
                            <View className='at-col'>{item.sumScore}</View>
                        </View>
                    </View>
                ))
            }

        </View>
    }

    loadMoreEvt = async () => {
        if (this.state.finished) {
            return false;
        }
        const { year, month, current, list } = this.state;
        const { dispatch } = this.props;
        await dispatch({
            type: 'integral/queryAllPageListForOrg',
            payload: { year: year, month: month,  current: current, pageSize: 10 }
        })
        const { orgRank } = this.props;
        this.setState({
            list: list.concat(orgRank.list),
            finished: orgRank.list.length < 10 ? true : false,
            current: current + 1,
            loading: false
        })
    }

    render() {
        const { activeTab, itemList, year, month } = this.state;
        const { orgRank } = this.props;

        return (
            <View className='integralRank-wrap'>
                <ScrollView className='wrap' scrollY scrollWithAnimation onScrollToLower={this.loadMoreEvt.bind(this)}>
                    <View className='head'>
                        <View className='at-row'>
                            <View className='at-col head-left'>
                                <View>
                                    <Picker mode='selector' range={itemList} onChange={this.onChange}>
                                        <Text>{year + '年'}{month && month != '0' ? month + '月' : ''}</Text>
                                        <AtIcon value='chevron-down' prefixClass='icon icon-sanjiaoxuanze' size='5' color='#fff'></AtIcon>
                                    </Picker>
                                </View>
                            </View>
                            <View className='at-col head-right'>
                                <View>
                                    <Text className={`${activeTab == 'year' ? 'active' : ''}`} onClick={this.changeTab.bind(this, 'year')}>年</Text>
                                    <AtIcon value='clock' prefixClass='icon icon-nianyueqiehuan' size='14' color='#fff'></AtIcon>
                                    <Text className={`${activeTab == 'month' ? 'active' : ''}`} onClick={this.changeTab.bind(this, 'month')}>月</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className='panel'>
                        <View className='panel__content'>

                            {
                                orgRank && orgRank.list && orgRank.list.length > 0 && this.renderList()
                            }

                        </View>
                    </View>

                </ScrollView>

                <View className='footer'>
                    <View className='at-row'>
                        <Text className='rank'>{orgRank.orgRank}</Text>
                        <Dimage src='' type='' />
                        <View >
                            <View className='user-name'>{orgRank.orgName}</View>
                        </View>
                        <View className='at-col'>{orgRank.orgSumScore}</View>
                    </View>
                </View>
            </View>
        )
    }
}

export default IntegralRank
