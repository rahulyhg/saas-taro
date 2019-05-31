import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtCurtain, AtIcon } from 'taro-ui'
import Dimage from '../../../../pages/common/dimage'
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
        navigationBarTitleText: '党费管理'
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
                        <View className='title'>政企业务运营支部</View>
                        <View className='at-col'>
                            <AtIcon value='chevron-down' size='17' color='#333333'></AtIcon>
                        </View>
                    </View>
                    <View className='at-row'>
                        <View className='at-col van-hairline--right'>
                            <Text>应缴人数 6人</Text>
                            <Text>未缴纳 2人</Text>
                        </View>

                        <View className='arrow'>
                            <Text>去提醒TA</Text>
                            <AtIcon value='chevron-right' size='14' color='#999'></AtIcon>
                        </View>

                    </View>
                </View>

                <View className='item van-hairline--bottom'>
                    <View className='at-row'>
                        <Dimage type='avatar' src='' />
                        <View className='at-col'>
                            李军
                        </View>
                        <View className='at-col'>
                            10.00
                        </View>
                        <View className='at-col' >
                            <Text className='active'>已缴纳</Text>
                        </View>
                    </View>
                </View>


                <View className='item'>
                    <View className='at-row'>
                        <Dimage type='avatar' src='' />
                        <View className='at-col'>
                            李军
                        </View>
                        <View className='at-col'>
                            暂无
                        </View>
                        <View className='at-col' >
                            <Text>未缴纳</Text>
                        </View>
                    </View>
                </View>
                <AtCurtain closeBtnPosition={'top'}
                    isOpened={true}
                >
                    <View className='dues-modal'>
                        <View className='title'>政企业务运营支部</View>
                        <View className='users'>
                            <View className='at-row at-row--wrap'>
                                <View className='at-col at-col-3'>
                                    <Dimage src='' type='avatar' />
                                    <View>杨国超</View>
                                </View>
                            </View>
                        </View>

                        <View className='btn'>
                            <AtButton type='primary' >立即提醒</AtButton>
                        </View>

                    </View>

                </AtCurtain>

            </View>
        )
    }
}

export default Dues
