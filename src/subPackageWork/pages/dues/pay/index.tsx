import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtInput } from 'taro-ui'
// import { connect } from '@tarojs/redux'
// import Tips from '../../utils/tips'
// const remoteImgPreUrl = process.env.remoteImgPreUrl
import { DuesProps, DuesState } from './index.interface'
import './index.scss'
import Dimage from '../../../../pages/common/dimage'
// import {  } from '../../components'

// @connect(({ dues }) => ({
//     ...dues,
// }))

class Dues extends Component<DuesProps, DuesState> {
    config: Config = {
        navigationBarTitleText: '党费缴纳'
    }
    constructor(props: DuesProps) {
        super(props)
        this.state = {}
    }

    componentDidMount() {

    }

    render() {
        return (
            <View className='edit-wrap'>
                <View className='head van-hairline--bottom'>
                    <View className='at-row'>
                        <Dimage src='' type='avatar' />
                        <View className='at-col'>
                            <View className='user-name'>李明</View>
                            <View className='org-name'>政企运营中心党支部</View>
                        </View>

                    </View>
                </View>

                <View className='container'>
                    <View className='money'>
                        <View className='info'>特殊党费缴纳</View>
                        <View className='title'>缴纳金额</View>
                        <View className='at-row'>
                            <Text>￥</Text>
                            <View className='at-col'>
                                <AtInput
                                    clear
                                    border={false}
                                    placeholder=''
                                    type='text'
                                />
                            </View>

                        </View>
                    </View>

                    <View className='info'>
                        <View className='at-row'>
                            <View>收费组织</View>
                            <View className='at-col'>联通党支部</View>
                        </View>
                    </View>

                </View>

                <View className='btn'>
                    <AtButton type='primary' >立即缴纳</AtButton>
                </View>
            </View>
        )
    }
}

export default Dues
