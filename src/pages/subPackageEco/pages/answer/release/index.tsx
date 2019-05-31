import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Button, Block, Input, Textarea } from '@tarojs/components'
// import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { ReleaseProps, ReleaseState } from './index.interface'
import './index.scss'
// import {  } from '../../components'

// @connect(({ release }) => ({
//     ...release,
// }))

class Release extends Component<ReleaseProps, ReleaseState> {
    config: Config = {
        navigationBarTitleText: '发布趣味答题',
        navigationBarBackgroundColor: "#FF4D4F",
        navigationBarTextStyle: "white"
    }
    constructor(props: ReleaseProps) {
        super(props)
        this.state = {
            isEditVisible: true
        }
    }

    componentDidMount() {

    }

    onActionSheet() {
        Taro.showActionSheet({
            itemList: ['单选题', '多选题']
        }).then(res => console.log(res))
            .catch(err => console.log(err))
    }

    render() {
        const { isEditVisible } = this.state;
        const list = ['1', '2', '3']
        return (
            <View className='release-wrap'>
                {
                    isEditVisible ? (
                        <Block>
                            <View className='head'>
                                <View className='title'>我是活动名称</View>
                            </View>
                            {
                                list && list.map((item, index) => {
                                    return (
                                        <View className='option-item'>
                                            <View className='title'><Text>单选题</Text>1.全新一代数据可视化解决方案致力于提供一套简单方便专业可靠</View>
                                            {
                                                index % 2 == 0 ? (<View className='icon icon-shanchu' style={'font-size:14px'}>
                                                    <Text className='info'>全新一代数据可视化解决方案致力于提供一套简单方便专业可靠</Text>
                                                </View>) : (<View>多选</View>)
                                            }
                                        </View>
                                    )
                                })
                            }
                            <View className='container'>
                                <View className='add icon icon-xiaji'><Text style={'padding-left:4px;color:#333'} onClick={this.onActionSheet}>点击添加答题选项</Text></View>
                            </View>
                            <View className='footer'>
                                <Button className='btn' plain type='primary'>发布活动</Button>
                            </View>
                        </Block>
                    ) : (
                            <View className='form'>
                                <View className='form-item van-hairline--bottom'>
                                    <Input placeholder='点击编辑答题题目' className='' />
                                </View>
                                <View className='question-item van-hairline--bottom'>
                                    <View className='form-item flex flex-start'>
                                        <Textarea value='' placeholder='点击编辑答题选项' className='flex-item' autoHeight={true} />
                                        <View className='icon icon-shanchu' style={'font-size:17px;color:#999;padding-top:16px'}></View>
                                    </View>
                                    <View className='form-item flex action'>
                                        <View className='icon icon-shanchu' style={'font-size:14px;color:#999;'}></View>
                                        <Text className='flex-item'>设为正确答案</Text>
                                    </View>
                                </View>
                                <View className='flex add-action'>
                                    <View className='icon icon-shanchu' style={'font-size:14px;color:#FF4D4F;'}></View>
                                    <Text className='flex-item'>新增选项</Text>
                                </View>

                                <Button className='btn-save' type='primary'>保存</Button>

                                <Button className='btn-cancel' type='default'>删除</Button>


                            </View>
                        )
                }
            </View>

        )
    }
}

export default Release
