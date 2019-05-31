import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import { connect } from '@tarojs/redux'
// import Tips from '../../utils/tips'
// const remoteImgPreUrl = process.env.remoteImgPreUrl
import { ExamSuccessProps, ExamSuccessState } from './index.interface'
import './index.scss'
// import {  } from '../../components'

// @connect(({ examSuccess }) => ({
//     ...examSuccess,
// }))

class ExamSuccess extends Component<ExamSuccessProps,ExamSuccessState > {
    config:Config = {
        navigationBarTitleText: '标题'
    }
    constructor(props: ExamSuccessProps) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        
    }

    render() {
        return (
        <View className='examSuccess-wrap'>
            
        </View>
        )
    }
}

export default ExamSuccess
