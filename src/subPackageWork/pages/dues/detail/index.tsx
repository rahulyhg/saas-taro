import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtNoticebar, AtListItem, AtIcon } from 'taro-ui'
// import { connect } from '@tarojs/redux'
// import Tips from '../../utils/tips'
// const remoteImgPreUrl = process.env.remoteImgPreUrl
import { DuesProps, DuesState } from './index.interface'
import './index.scss'
import Dimage from '../../../../../src/pages/common/dimage'
// import {  } from '../../components'

// @connect(({ dues }) => ({
//     ...dues,
// }))

class Dues extends Component<DuesProps, DuesState> {
    config: Config = {
        navigationBarTitleText: '个人党费'
    }
    constructor(props: DuesProps) {
        super(props)
        this.state = {}
    }

    componentDidMount() {

    }

    render() {
        return (
            <View className='dues-wrap'>

                <View className='head van-hairline--bottom'>
                    <View className='at-row'>
                        <Dimage src='' type='avatar' />
                        <View className='at-col'>
                            <View className='user-name'>张三</View>
                            <View className='info'>政企运营中心党支部</View>
                        </View>
                        <Text>编辑</Text>
                    </View>
                </View>

                <View className='container'>
                    <View className='title'>本月党费已缴纳</View>

                    <View className='info'>
                        <View className='at-row'>
                            <View>生效时间</View>
                            <View className='at-col'>2019-05</View>
                        </View>

                        <View className='at-row'>
                            <View>缴纳标准</View>
                            <View className='at-col'>10元/月</View>
                        </View>

                        <View className='at-row'>
                            <View>党员状态</View>
                            <View className='at-col'>正常</View>
                        </View>
                    </View>

                </View>

                <View className='fee'>
                    <View className='title'>2019年4月、5月党费</View>

                    <View className='info'>
                        <View className='at-row'>
                            <View className='fee-label'>应缴金额</View>
                            <View className='at-col money'>10.00</View>
                        </View>

                        <View className='at-row'>
                            <View>收费组织</View>
                            <View className='at-col'>联通党支部</View>
                        </View>

                    </View>

                </View>

                <View className='action'>
                    <View className='action-item van-hairline--bottom'>
                        <View className='at-row'>
                            <View className='at-col'>
                                <AtIcon value='bookmark' size='30' />
                                <Text>特殊党费</Text>
                            </View>
                            <View className='at-col'>
                                <Text className='info'>以党费的形式捐款</Text>
                                <AtIcon value='chevron-right' size='20' color='#999' />
                            </View>
                        </View>
                    </View>

                    <View className='action-item'>
                        <View className='at-row'>
                            <View className='at-col'>
                                <Text>查询缴纳记录</Text>
                            </View>
                            <View className='at-col'>
                                <AtIcon value='chevron-right' size='20' color='#999' />
                            </View>
                        </View>
                    </View>

                </View>

                <View className='btn'>
                    <View className='at-row'>
                        <View className='at-col'>
                            <Text>缴纳方式</Text>
                        </View>
                        <View className='at-col'>
                            <Text>现金</Text>
                            <AtIcon value='chevron-right' size='20' color='#999' />
                        </View>
                    </View>
                    <AtButton className='fee-btn' type='primary' >立即缴纳</AtButton>
                    <AtButton className='fee-btn' >提醒TA缴纳</AtButton>
                </View>

                <View className='footer'>
                    <Text>查询缴纳记录</Text>
                </View>
            </View>
        )
    }
}

export default Dues
