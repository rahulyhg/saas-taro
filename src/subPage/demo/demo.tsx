import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
 import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { DemoProps, DemoState } from './demo.interface'
import deepClone from 'lodash.clonedeep'
const WeValidator = require('we-validator')
import './demo.scss'
// import {  } from '../../components'

 @connect(({ demo }) => ({
     ...demo,
 }))

class Demo extends Component<DemoProps,DemoState > {
  config:Config = {
    navigationBarTitleText: '标题'
  }
  constructor(props: DemoProps) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    
  }
  sayHi = () =>{

    const {dispatch} = this.props;
    const tt = deepClone({name:'123'})
    dispatch({
      type:'demo/update',
      payload:{name:'wangxiao'}
    })
  }

  render() {
    const {name} = this.props;
    return (
      <View className='fx-demo-wrap'>
          <View>你好：{name}</View>
          <View onClick={this.sayHi}>打招呼</View>
      </View>
    )
  }
}

export default Demo
