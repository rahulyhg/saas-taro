import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtTextarea, AtInput, AtButton } from 'taro-ui'
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


    render() {
        return (
            <View className='transfer-wrap'>
                <View className='card'>
                    <View className='head'>
                        <Text>介绍信</Text>
                    </View>
                    <View className='title'>
                        共产党政企运营中心委员会
                    </View>

                    <View className='info'>
                        <View>
                            <Text className='user-name'>张明明</Text>
                            <Text className='user-state'>中共正式党员</Text>
                        </View>
                        <View className='org'>组织关系</View>
                        <View className='state'>
                            <Text>转</Text><Text>政企事业部运营支部</Text>
                        </View>
                        <View className='state'>
                            <Text>接</Text><Text>政企事业部运营支部</Text>
                        </View>
                    </View>


                    <View className='footer'>
                        <View>浩鲸云科技委员会     </View>
                        <View>2019年04月20日     </View>
                    </View>
                </View>
            </View>
        )
    }
}

export default Transfer
