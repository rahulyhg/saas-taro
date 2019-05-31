import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { DemoProps, DemoState } from './demo.interface'
import './demo.scss'
// import {  } from '../../components'

@connect(({ demo }) => ({
  ...demo,
}))

class Demo extends Component<DemoProps, DemoState> {
  config: Config = {
    navigationBarTitleText: '测试'
  }
  constructor(props: DemoProps) {
    super(props)
    this.state = {
      type: 'org',
      list: []
    }
  }

  componentDidMount() {

  }
  componentDidShow() {
    console.table(this.props.list)
  }
  go() {
    Taro.navigateTo({
      url: '/pages/common/userPopView/userPopView'
    })
  }
  render() {
    return (
      <View className='fx-demo-wrap'>
        <View onClick={this.go}>跳转</View>
      </View>
    )
  }
}

export default Demo
