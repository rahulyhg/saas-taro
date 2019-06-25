import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { connect } from '@tarojs/redux'
// import Tips from '../../utils/tips'
// const remoteImgPreUrl = process.env.remoteImgPreUrl
import { RecordIndexProps, RecordIndexState } from './index.interface'
import './index.scss'
import Dimage from '../../common/dimage';
import { element } from 'prop-types';
import { type } from 'os';
// import {  } from '../../components'

@connect(({ integral }) => ({
    ...integral,
}))

class RecordIndex extends Component<RecordIndexProps, RecordIndexState> {
    config: Config = {
        navigationBarTitleText: '个人积分'
    }
    constructor(props: RecordIndexProps) {
        super(props)
        this.state = {
            activeTab: 'year',
            yearList: [],
            monthList: [],
            itemList: [],
            year: '',
            month: ''
        }
    }

    componentDidMount() {
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
            month: '0'
        }, () => {
            const { year, month } = this.state;
            const { dispatch } = this.props;
            dispatch({
                type: 'integral/queryByUserIdForScore',
                payload: { year: year, month: month }
            })
        })
    }


    onChange = e => {
        const { activeTab, itemList } = this.state;
        if (activeTab == 'year') {
            this.setState({
                year: itemList[e.detail.value],
                month: ''
            }, () => {
                const { dispatch } = this.props;
                dispatch({
                    type: 'integral/queryByUserIdForScore',
                    payload: { year: this.state.year, month: '0' }
                })
            })
        } else {
            this.setState({
                year: itemList[e.detail.value].split('-')[0],
                month: itemList[e.detail.value].split('-')[1]
            }, () => {
                const { dispatch } = this.props;
                dispatch({
                    type: 'integral/queryByUserIdForScore',
                    payload: { year: this.state.year, month: this.state.month }
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
        }, () => {
            const { year, month } = this.state;
            const { dispatch } = this.props;
            dispatch({
                type: 'integral/queryByUserIdForScore',
                payload: { year: year, month: month }
            })
        })
    }

    goRank = (type, e) => {
        Taro.navigateTo({
            url: type == 'user' ? '/pages/user/integralRank/index' : '/pages/user/orgRank/index'
        })
    }

    goRankRecord = (type, e) => {
        const { year, month } = this.state;
        Taro.navigateTo({
            url: '/pages/user/recordRank/index?type=' + type + '&year=' + year + '&month=' + month
        })
    }

    render() {
        const { activeTab, itemList, year, month } = this.state;
        const { rankDetail } = this.props;

        return (
            <View className='recordIndex-wrap'>
                <View className='head'>
                    <View className='at-row user'>
                        <Dimage src='' type='avatar' />
                        <View className='at-col'>
                            <View className='user-name'>张明明</View>
                            <View className='org-name'>智慧城市党建支部</View>
                        </View>
                    </View>
                    <View className='banner'>
                        <View className='at-row'>
                            <View className='at-col banner-left'>

                                <View>
                                    <Picker mode='selector' range={itemList} onChange={this.onChange}>
                                        <Text>{year + '年'}{month && month != '0' ? month + '月' : ''}</Text> <AtIcon value='chevron-down' prefixClass='icon icon-sanjiaoxuanze' size='5' color='#333'></AtIcon>
                                    </Picker>
                                </View>
                            </View>
                            <View className='at-col banner-right'>
                                <View>
                                    <Text className={`${activeTab == 'year' ? 'active' : ''}`} onClick={this.changeTab.bind(this, 'year')}>年</Text>
                                    <AtIcon value='clock' prefixClass='icon icon-nianyueqiehuan' size='14' color='#333'></AtIcon>
                                    <Text className={`${activeTab == 'month' ? 'active' : ''}`} onClick={this.changeTab.bind(this, 'month')}>月</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View className='card'>
                    <View className='card-body user-body'>
                        <View className='title'>{rankDetail.personSumScore}</View>
                        <View className='info at-row'>
                            <View className='at-col name'>本年个人积分</View>
                            <View className='at-col'>
                                <AtIcon value='clock' prefixClass='icon icon-paiming' size='12' color='#fff'></AtIcon>
                                <Text>{rankDetail.personRank == '暂无排名' ? '暂无排名' : ('第' + rankDetail.personRank + '名')}</Text>
                                <AtIcon value='clock' prefixClass='icon icon-xiajiang' size='12' color='#fff'></AtIcon>
                            </View>
                        </View>
                    </View>
                    <View className='card-footer'>
                        <View className='at-row'>
                            <View className='at-col footer-left van-hairline--right' onClick={this.goRank.bind(this, 'user')}>
                                个人排行榜
                            </View>
                            <View className='at-col footer-right' onClick={this.goRankRecord.bind(this, '0')}>
                                积分明细
                            </View>
                        </View>
                    </View>
                </View>

                <View className='card'>
                    <View className='card-body org-body'>
                        <View className='title'>{rankDetail.orgSumScore}</View>
                        <View className='info at-row'>
                            <View className='at-col name'>本年组织积分</View>
                            <View className='at-col'>
                                <AtIcon value='clock' prefixClass='icon icon-paiming' size='12' color='#fff'></AtIcon>
                                <Text>{rankDetail.orgRank == '暂无排名' ? '暂无排名' : ('第' + rankDetail.orgRank + '名')}</Text>
                                <AtIcon value='clock' prefixClass='icon icon-xiajiang' size='12' color='#fff'></AtIcon>
                            </View>
                        </View>
                    </View>
                    <View className='card-footer'>
                        <View className='at-row'>
                            <View className='at-col footer-left van-hairline--right' onClick={this.goRank.bind(this, 'org')}>
                                组织排行榜
                            </View>
                            <View className='at-col footer-right' onClick={this.goRankRecord.bind(this, '1')}>
                                积分明细
                            </View>
                        </View>
                    </View>
                </View>

            </View>
        )
    }
}

export default RecordIndex