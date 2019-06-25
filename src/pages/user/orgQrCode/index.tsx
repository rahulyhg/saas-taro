import Taro, { Component, Config } from '@tarojs/taro'
import { View ,Text} from '@tarojs/components'
// import { connect } from '@tarojs/redux'
// import Tips from '../../utils/tips'
// const remoteImgPreUrl = process.env.remoteImgPreUrl
import { OrgQrCodeProps, OrgQrCodeState } from './index.interface'
import './index.scss'
// import {  } from '../../components'

// @connect(({ orgQrCode }) => ({
//     ...orgQrCode,
// }))

class OrgQrCode extends Component<OrgQrCodeProps,OrgQrCodeState > {
    config:Config = {
        navigationBarTitleText: '我的组织'
    }
    constructor(props: OrgQrCodeProps) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        
    }

    render() {
        return (
        <View className='orgQrCode-wrap'>
            <View className='title'>中共中国西电集团有限公司集团直属党委宣传部党委</View>
            <View className='info'>扫一扫加入该组织</View>
            <View className='qrcode'>
                <View className='icon icon-erweima'></View>
            </View>
            <View className='footer'>
                <Text className='van-hairline--right'>分享图片</Text>
                <Text>保存图片</Text>
            </View>
        </View>
        )
    }
}

export default OrgQrCode