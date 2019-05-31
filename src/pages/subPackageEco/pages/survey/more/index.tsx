import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { MoreProps, MoreState } from './index.interface'
import './index.scss'
import { connect } from '@tarojs/redux'
import DImage from "../../../../pages/common/dimage"

import _lodash from 'underscore';
import { listenerCount } from 'cluster';

const color = ["#FADBD8", "#FDEDEC", "#E8DAEF", "#F4ECF6", "#D6EAF8", "#EBF5FA", "#D0ECE7", "#E8F8F5", "#D5F5E3", "#EAF7EF", "#FDEBD0", "#FEF5E8", "#F6DDCC", "#FBEEE7", "#E5E8E8", "#F2F4F4", "#F7F5DD", "#ECE9D2", "#F9F1D4", "#E9EDE4", "#EFF1EB", "#F2EBE6", "#EFEFF5", "#EFF1EB", "#EFECF1", "#EDF4F8"]
@connect(({ surveyJoin }) => ({
    ...surveyJoin,
}))
class SurveyDetail extends Component<MoreProps, MoreState> {
    config: Config = {
        navigationBarTitleText: '调查详情'
    }
    constructor(props: MoreProps) {
        super(props);

    }

    componentDidMount() {
        this.loadMore();
    }

    loadMore = async () => {
        const { dispatch } = this.props;
        await dispatch({
            type: 'surveyJoin/getAnswerValueList',
            payload: {
                questionId: '291869942598090752',
                answerId: '291869942598090756',
                current: 1,
                pageSize: 10
            }
        })
        this.setState({
            list: this.props.answerValueList
        })


    }

    render() {
        const { list } = this.state;
        return (
            <View className="comment">
                <View className='title'>{this.$router.params.title}</View>
                {
                    list && list.map((item,index) => (
                        <View className="comment-item">
                            <View className="background" style={{ 'background': color[index%26] }}></View>
                            <View className="header">
                                <View className="user">
                                    <View className="avatar">
                                        <DImage src={item.attendUserAvatar} type='avatar' />
                                    </View>
                                    <View className="info">
                                        <View className="name normal-text-black">{item.attendUserName}</View>
                                        <View className="time norml-text-gray">1小时前</View>
                                    </View>
                                </View>
                            </View>
                            <View className="content">
                                <Text>{item.value}</Text>
                            </View>
                        </View>
                    ))
                }


                <View className="loading-tips">
                    <Text>- END -</Text>
                </View>


            </View>
        )
    }
}

export default SurveyDetail
