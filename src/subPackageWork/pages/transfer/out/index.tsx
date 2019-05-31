import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtTextarea, AtInput } from 'taro-ui'
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
                <View className='item'>
                    <View className='at-row van-hairline--bottom'>
                        <View className='at-col'>
                            当前组织
                    </View>
                        <Text>请选择</Text>
                        <AtIcon value='chevron-right' size='16' />
                    </View>

                    <View className='at-row van-hairline--bottom'>
                        <View className='at-col'>
                            调动人员
                    </View>
                        <Text>请选择</Text>
                        <AtIcon value='chevron-right' size='16' />
                    </View>

                    <View className='at-row van-hairline--bottom'>
                        <View className='at-col'>
                            目标组织
                    </View>
                        <AtInput />
                    </View>

                    <View className='label'>
                        调动原因
                    </View>
                    <AtTextarea
                        count={false}
                        placeholder='请输入调动原因'
                    />


                </View>
            </View>
        )
    }
}

export default Transfer
