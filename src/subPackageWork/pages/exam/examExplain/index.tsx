import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import { connect } from '@tarojs/redux'
// import Tips from '../../utils/tips'
// const remoteImgPreUrl = process.env.remoteImgPreUrl
import { ExamExplainProps, ExamExplainState } from './index.interface'
import './index.scss'
// import {  } from '../../components'

// @connect(({ examExplain }) => ({
//     ...examExplain,
// }))

class ExamExplain extends Component<ExamExplainProps,ExamExplainState > {
    config:Config = {
        navigationBarTitleText: '标题'
    }
    constructor(props: ExamExplainProps) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        
    }

    render() {
        return (
        <View className='examExplain-wrap'>
            
        </View>
        )
    }
}

export default ExamExplain
