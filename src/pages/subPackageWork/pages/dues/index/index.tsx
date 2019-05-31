import Taro, { Component, Config } from '@tarojs/taro'
import { View,Text } from '@tarojs/components'
import { AtButton,AtNoticebar} from 'taro-ui'
// import { connect } from '@tarojs/redux'
// import Tips from '../../utils/tips'
// const remoteImgPreUrl = process.env.remoteImgPreUrl
import { DuesProps, DuesState } from './index.interface'
import './index.scss'
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
                <AtNoticebar icon='volume-plus'>目前暂不支持微信端党费缴纳，仅支持支付宝</AtNoticebar>
                <View className='head van-hairline--bottom'>2019年5月、4月党费</View>
                <View className='container'>
                    <View className='money'>
                        <View className='at-row'>
                            <View>应缴金额</View>
                            <View className='at-col'>52.00</View>
                        </View>
                    </View>

                    <View className='info'>
                        <View className='at-row'>
                            <View>姓名</View>
                            <View className='at-col'>张帅</View>
                        </View>

                        <View className='at-row'>
                            <View>收费组织</View>
                            <View className='at-col'>联通党支部</View>
                        </View>

                        <View className='at-row'>
                            <View>缴纳标准</View>
                            <View className='at-col'>10.00元</View>
                        </View>

                    </View>

                </View>

                <View className='btn'>
                    <AtButton type='primary' >立即缴纳</AtButton>
                </View>

                <View className='footer'>
                    <Text>缴纳记录</Text><Text className='diver'>|</Text><Text>特殊党费</Text>
                </View>
            </View>
        )
    }
}

export default Dues
