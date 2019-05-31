import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton, AtListItem } from 'taro-ui'
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
        navigationBarTitleText: '党费编辑'
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
                        <Text>流动党员</Text>
                    </View>
                </View>

                <View  className='list'>
                    <AtListItem arrow='right' title='生效时间' extraText='2019-03' />
                    <AtListItem arrow='right' title='缴纳标准' extraText='10.00元/月' />
                </View>

                <View className='btn'>
                    <AtButton type='primary' >确定</AtButton>
                </View>
            </View>
        )
    }
}

export default Dues
