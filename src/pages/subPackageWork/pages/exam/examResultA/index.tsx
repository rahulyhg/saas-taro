import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import { connect } from '@tarojs/redux'
// import Tips from '../../utils/tips'
// const remoteImgPreUrl = process.env.remoteImgPreUrl
import { ExamResultAProps, ExamResultAState } from './index.interface'
import './index.scss'
// import {  } from '../../components'

// @connect(({ examResultA }) => ({
//     ...examResultA,
// }))

class ExamResultA extends Component<ExamResultAProps,ExamResultAState > {
    config:Config = {
        navigationBarTitleText: '标题'
    }
    constructor(props: ExamResultAProps) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        
    }

    render() {
        return (
        <View className='examResultA-wrap'>
            
        </View>
        )
    }
}

export default ExamResultA
