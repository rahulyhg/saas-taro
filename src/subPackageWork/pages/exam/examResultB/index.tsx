import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import { connect } from '@tarojs/redux'
// import Tips from '../../utils/tips'
// const remoteImgPreUrl = process.env.remoteImgPreUrl
import { ExamResultBProps, ExamResultBState } from './index.interface'
import './index.scss'
// import {  } from '../../components'

// @connect(({ examResultB }) => ({
//     ...examResultB,
// }))

class ExamResultB extends Component<ExamResultBProps,ExamResultBState > {
    config:Config = {
        navigationBarTitleText: '标题'
    }
    constructor(props: ExamResultBProps) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        
    }

    render() {
        return (
        <View className='examResultB-wrap'>
            
        </View>
        )
    }
}

export default ExamResultB
