import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtTextarea, AtInput,AtButton } from 'taro-ui'
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
                <View className='section'>
                    <AtInput
                        name='value1'
                        title='用户名'
                        type='text'
                    />

                    <AtInput
                        name='value1'
                        title='姓名'
                        type='text'
                    />

                    <AtInput
                        name='value1'
                        title='手机'
                        type='text'
                    />

                    <AtInput
                        name='value1'
                        title='身份证'
                        type='text'
                    />

                    <View className='item'>
                        <View className='at-row van-hairline--bottom'>
                            <View className='at-col'>性别</View>
                            <Text>请选择</Text>
                            <AtIcon value='chevron-right' size='16' />
                        </View>
                    </View>

                    <View className='item'>
                        <View className='at-row van-hairline--bottom'>
                            <View className='at-col'>出生日期</View>
                            <Text>请选择</Text>
                            <AtIcon value='chevron-right' size='16' />
                        </View>
                    </View>

                    <View className='item'>
                        <View className='at-row van-hairline--bottom'>
                            <View className='at-col'>工作岗位</View>
                            <Text>请选择</Text>
                            <AtIcon value='chevron-right' size='16' />
                        </View>
                    </View>

                    <View className='item'>
                        <View className='at-row van-hairline--bottom'>
                            <View className='at-col'>民族</View>
                            <Text>请选择</Text>
                            <AtIcon value='chevron-right' size='16' />
                        </View>
                    </View>

                    <View className='item'>
                        <View className='at-row van-hairline--bottom'>
                            <View className='at-col'>学历</View>
                            <Text>请选择</Text>
                            <AtIcon value='chevron-right' size='16' />
                        </View>
                    </View>

                    <View className='item'>
                        <View className='at-row van-hairline--bottom'>
                            <View className='at-col'>籍贯</View>
                            <Text>请选择</Text>
                            <AtIcon value='chevron-right' size='16' />
                        </View>
                    </View>
                </View>

                <View className='section'>
                    <AtInput
                        name='value1'
                        title='当前组织'
                        type='text'
                    />

                    <AtInput
                        name='value1'
                        title='目标组织'
                        type='text'
                    />

                    <View className='item'>
                        <View className='at-row van-hairline--bottom'>
                            <View className='at-col'>党费缴纳时间</View>
                            <Text>请选择</Text>
                            <AtIcon value='chevron-right' size='16' />
                        </View>
                    </View>

                    <View className='item'>
                        <View className='at-row van-hairline--bottom'>
                            <View className='at-col'>类别</View>
                            <Text>请选择</Text>
                            <AtIcon value='chevron-right' size='16' />
                        </View>
                    </View>

                    <View className='item'>
                        <View className='at-row van-hairline--bottom'>
                            <View className='at-col'>入党时间</View>
                            <Text>请选择</Text>
                            <AtIcon value='chevron-right' size='16' />
                        </View>
                    </View>

                    <View className='item'>
                        <View className='at-row van-hairline--bottom'>
                            <View className='at-col'>转正时间</View>
                            <Text>请选择</Text>
                            <AtIcon value='chevron-right' size='16' />
                        </View>
                    </View>

                    <View className='label'>
                        调动原因
                    </View>
                    <AtTextarea
                        count={false}
                        placeholder='请输入调动原因'
                    />
                </View>

                <View className='btn'>
                    <AtButton type='primary'  >确定</AtButton>
                </View>
            </View>
        )
    }
}

export default Transfer
