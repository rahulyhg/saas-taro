import Taro, { Component, Config } from '@tarojs/taro'
import { View,Text } from '@tarojs/components'
// import { connect } from '@tarojs/redux'
// import Tips from '../../utils/tips'
// const remoteImgPreUrl = process.env.remoteImgPreUrl
import { OrgProps, OrgState } from './index.interface'
import './index.scss'
import Dimage from '../../common/dimage';
// import {  } from '../../components'

// @connect(({ org }) => ({
//     ...org,
// }))

class Org extends Component<OrgProps, OrgState> {
    config: Config = {
        navigationBarTitleText: '我的组织'
    }
    constructor(props: OrgProps) {
        super(props)
        this.state = {}
    }

    componentDidMount() {

    }

    // 积分
    goDetail = () =>{
        Taro.navigateTo({
            url:'/pages/user/orgQrCode/index'
        })
    }

    render() {
        return (
            <View className='org-wrap'>
                <View className='head'>
                    <View className='at-row'>
                        <Dimage src='' />
                        <View className='at-col'>
                            <View className='title'>中共中国西电集团有限公司集团直属党委宣传部党委</View>
                            <View className='at-row info'>
                                <View className='at-col'>党员数：100</View>
                                <View className='at-col'>下级组织： 9</View>
                                <View className='at-col'><View className='icon icon-erweima' onClick={this.goDetail}></View> </View> 
                            </View>
                        </View>
                    </View>
                </View>

                <View className='container'>
                    <View className='title'>领导班子</View>
                    <View className='item van-hairline--bottom'>
                        <View className='at-row'>
                            <Dimage src='' type='avatar' />
                            <View className='at-col user-name'>丁艳</View>
                            <View className='at-col'><Text className='post'>党委书记</Text></View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

export default Org

