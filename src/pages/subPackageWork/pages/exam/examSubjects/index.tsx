import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import { connect } from '@tarojs/redux'
// import Tips from '../../utils/tips'
// const remoteImgPreUrl = process.env.remoteImgPreUrl
import { ExamSubjectsProps, ExamSubjectsState } from './index.interface'
import './index.scss'
// import {  } from '../../components'

// @connect(({ examSubjects }) => ({
//     ...examSubjects,
// }))

class ExamSubjects extends Component<ExamSubjectsProps,ExamSubjectsState > {
    config:Config = {
        navigationBarTitleText: '标题'
    }
    constructor(props: ExamSubjectsProps) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        
    }

    render() {
        return (
        <View className='examSubjects-wrap'>
            
        </View>
        )
    }
}

export default ExamSubjects
