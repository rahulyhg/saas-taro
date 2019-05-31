import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtSearchBar, AtTabs, AtTabsPane } from 'taro-ui'
// import { connect } from '@tarojs/redux'
// import Tips from '../../utils/tips'
// const remoteImgPreUrl = process.env.remoteImgPreUrl
import { TransferProps, TransferState } from './index.interface'
import Dimage from '../../../../pages/common/dimage'
import './index.scss'
// import {  } from '../../components'

// @connect(({ dues }) => ({
//     ...dues,
// }))

class Transfer extends Component<TransferProps, TransferState> {
    config: Config = {
        navigationBarTitleText: '党员调动'
    }
    constructor(props: TransferProps) {
        super(props)
        this.state = {}
    }

    componentDidMount() {

    }

    // 搜索
    onSearchChage = e => {

    }

    // tab切换
    handleClick = e => {

    }

    render() {
        const tabList = [{ title: '待处理' }, { title: '我发起的' }, { title: '已处理' }]
        return (
            <View className='transfer-wrap'>
                <AtSearchBar value='' onChange={this.onSearchChage} />

                <AtTabs current={0} tabList={tabList} onClick={this.handleClick.bind(this)}>
                    <AtTabsPane current={0} index={0} >
                        <View className='list'>
                            <View className='item'>
                                <View className='at-row van-hairline--bottom'>
                                    <Dimage src='' type='avatr' />
                                    <View className='at-col'>
                                        <View className='user-name'>赖桂英</View>
                                        <View><Text>2019-04-25</Text><Text>平台外调入</Text></View>
                                    </View>
                                    <Text>待审批</Text>
                                </View>

                                <View className='info'>
                                    <Text className='state'>转</Text>
                                    <Text>政企行业运营支部</Text>
                                </View>

                                <View className='info'>
                                    <Text className='state'>接</Text>
                                    <Text>政企行业运营支部</Text>
                                </View>
                            </View>
                        </View>
                    </AtTabsPane>

                </AtTabs>
            </View>
        )
    }
}

export default Transfer
