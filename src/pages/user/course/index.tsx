import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
// import { connect } from '@tarojs/redux'
// import Tips from '../../utils/tips'
// const remoteImgPreUrl = process.env.remoteImgPreUrl
import { CourseProps, CourseState } from './index.interface'
import './index.scss'
import Dimage from '../../common/dimage';
// import {  } from '../../components'

// @connect(({ course }) => ({
//     ...course,
// }))

class Course extends Component<CourseProps, CourseState> {
    config: Config = {
        navigationBarTitleText: '标题'
    }
    constructor(props: CourseProps) {
        super(props)
        this.state = {}
    }

    componentDidMount() {

    }

    render() {
        return (
            <View className='course-wrap'>
                <View className='head'>

                    <Text>2019年</Text>
                    <AtIcon value='chevron-down' prefixClass='icon icon-sanjiaoxuanze' size='5' color='#333'></AtIcon>

                </View>
                <View className="timeline">
                    <View className='item'>
                        <View className='title'>2019年半年度民主评议活动</View>
                        <View className='time'>2019.06.19</View>
                    </View>

                    <View className='item'>
                        <View className='title'>2019年半年度民主评议活动</View>

                        <View className='at-row'>
                            <View className='at-col'>
                                <View className='content'>中国西电集团党委党支部培训课程</View>
                                <View className='time'>2019.06.19</View>
                            </View>
                            <Dimage src='https://imgsa.baidu.com/news/q%3D100/sign=4c76100635c79f3d89e1e0308aa0cdbc/5bafa40f4bfbfbed2e2f638676f0f736aec31fd0.jpg' type='' />
                        </View>
                        
                    </View>

                    
                </View>

            </View>
        )
    }
}

export default Course
