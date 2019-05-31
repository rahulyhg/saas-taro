import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
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
        navigationBarTitleText: '缴纳凭证'
    }
    constructor(props: DuesProps) {
        super(props)
        this.state = {}
    }

    componentDidMount() {

    }

    render() {
        return (
            <View className='msg-wrap'>
                <View className='head'>
                    <View className='icon icon-dangfei'></View>
                    <View className='info'>2019年5月党费</View>
                    <View className='money'><Text>￥</Text>60.00</View>
                </View>

                <View className='container'>
                    <View className='at-row'>
                        <View>姓名</View>
                        <View className='at-col'>张三</View>
                    </View>
                    <View className='at-row'>
                        <View>收费组织</View>
                        <View className='at-col'>联通党支部</View>
                    </View>
                    <View className='at-row'>
                        <View>缴纳时间</View>
                        <View className='at-col'>2019-05-20 14:00</View>
                    </View>
                    <View className='at-row'>
                        <View>缴纳方式</View>
                        <View className='at-col'>
                            <View className='icon icon-zhifubao'><Text>支付宝</Text></View>
                        </View>
                    </View>
                    <View className='at-row'>
                        <View>订单号</View>
                        <View className='at-col'>2019050915345745123510</View>
                    </View>
                </View>


            </View>
        )
    }
}

export default Dues
