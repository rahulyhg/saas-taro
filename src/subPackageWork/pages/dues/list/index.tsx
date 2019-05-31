import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtNoticebar, AtIcon } from 'taro-ui'
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
        navigationBarTitleText: '缴纳记录'
    }
    constructor(props: DuesProps) {
        super(props)
        this.state = {}
    }

    componentDidMount() {

    }

    render() {
        return (
            <View className='list-wrap'>
                <View className='head van-hairline--bottom'>缴纳查找<AtIcon value='chevron-down' size='14' color='#333'></AtIcon></View>

                <View className='year van-hairline--bottom'>
                    <View className='title at-row van-hairline--bottom'>
                        <View className='at-col'>2019年</View>
                        <View className='at-col'>合计 ￥120</View>
                    </View>

                    <View className='item '>
                        <View className='at-row'>
                            <View className='icon icon-zhengque'></View>
                            <View className='at-col van-hairline--bottom item-container'>
                                <View className='at-row'>
                                    <View className='at-col'>
                                        <View className='name'>
                                            2019年5月党费
                                        </View>
                                        <View className='info'>
                                            05-09 15:34
                                        </View>
                                    </View>
                                    <View className='money'>
                                        45.00
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className='item '>
                        <View className='at-row'>
                            <View className='icon icon-zhengque'></View>
                            <View className='at-col  item-container'>
                                <View className='at-row'>
                                    <View className='at-col'>
                                        <View className='name'>
                                            2019年5月党费
                                        </View>
                                        <View className='info'>
                                            05-09 15:34
                                        </View>
                                    </View>
                                    <View className='money'>
                                        45.00
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>


                </View>

            </View>
        )
    }
}

export default Dues
