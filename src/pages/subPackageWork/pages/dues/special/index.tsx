import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtIcon, AtInput } from 'taro-ui'
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
            <View className='special-wrap'>
                <View className='head van-hairline--bottom'>特殊党费缴纳</View>
                <View className='container'>
                    <View className='money'>
                        <View className='title'>缴纳金额</View>
                        <View className='at-row'>
                            <Text>￥</Text>
                            <View className='at-col'>
                                <AtInput
                                    clear
                                    border={false}
                                    placeholder=''
                                    type='text'
                                    value=''
                                />
                            </View>

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

                <View className='remark'>
                    <AtInput
                        name='value1'
                        title='备注'
                        type='text'
                        placeholder='单行文本'
                    />
                </View>

                <View className='btn'>
                    <AtButton type='primary' >立即缴纳</AtButton>
                </View>

                <View className='footer'>
                    <Text>缴纳记录</Text>
                </View>
            </View>
        )
    }
}

export default Dues
