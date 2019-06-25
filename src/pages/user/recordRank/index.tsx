import Taro, { Component, Config } from "@tarojs/taro";
import { AtTabs, AtTabsPane } from 'taro-ui'
// eslint-disable-next-line
import { IntegralRankProps, IntegralRankState } from "./index.interface";
import { connect } from '@tarojs/redux'
// import Tips from '../../utils/tips'
// const remoteImgPreUrl = process.env.remoteImgPreUrl
import { View, Text, ScrollView } from "@tarojs/components";
import './index.scss'
import Nodata from "../../common/nodata";
// import {  } from '../../components'

@connect(({ integral }) => ({
    ...integral
}))

class IntegralRank extends Component<IntegralRankProps, IntegralRankState> {
    config: Config = {
        navigationBarTitleText: '积分记录'
    }
    constructor(props: IntegralRankProps) {
        super(props)
        this.state = {
            current: 1,
            loading: false,
            finished: false,
            list: []
        }
    }

    componentDidMount() {
        const { dispatch } = this.props;
        this.setState({
            loading: true,
            list: []
        }, async () => {
            await dispatch({
                type: 'integral/queryIntegralDetailList',
                payload: {
                    current: 1,
                    pageSize: 10,
                    type: this.$router.params.type,
                    year: this.$router.params.year,
                    month: this.$router.params.month
                }
            })
            const { detailList } = this.props;
            const { current } = this.state;
            this.setState({
                loading: false,
                list: detailList,
                finished: detailList.length < 10 ? true : false,
                current: current + 1

            })
        })

    }

    loadMoreEvt = async () => {
        const { finished, current, list } = this.state;
        if (finished) {
            return false;
        }
        const type = this.$router.params.type;
        const year = this.$router.params.year;
        const month = this.$router.params.month;
        const { dispatch } = this.props;
        await dispatch({
            type: 'integral/queryIntegralDetailList',
            payload: { year: year, month: month, type: type, current: current, pageSize: 10 }
        })
        const { detailList } = this.props;
        this.setState({
            list: list.concat(detailList),
            finished: detailList.length < 10 ? true : false,
            current: current + 1,
            loading: false
        })
    }

    render() {
        const { detailList } = this.props;
        return (
            <View className='recordRank-wrap'>
                <ScrollView className='wrap' scrollY scrollWithAnimation onScrollToLower={this.loadMoreEvt.bind(this)}>
                    <View className='panel'>

                        {/* <View className='panel-title'>
                            2019年5月
                        </View> */}
                        <View className='panel-body'>
                            {
                                detailList && detailList.map(item => (
                                    <View className='item'>
                                        <View className='at-row'>
                                            <View className='at-col title'>{item.typeName}</View>
                                            <Text className='score'>+{item.score}</Text>
                                        </View>
                                        <View className='at-row'>
                                            <View className='at-col org-name'>{item.businessName}</View>
                                            <Text className='time'>{item.businessTime}</Text>
                                        </View>
                                        <View>{item.ruleName}</View>
                                    </View>
                                ))
                            }

                        </View>
                    </View>
                    <Nodata show={ detailList.length <= 0} notice='暂无数据' stylevalue='margin-top: 48rpx;' />

                </ScrollView>
            </View>
        )
    }
}

export default IntegralRank
