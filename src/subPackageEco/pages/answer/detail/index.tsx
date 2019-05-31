import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AnswerDetailProps, AnswerDetailState } from './index.interface'
import './index.scss'
import { formatDate } from '../../../../utils/common'
import Dimage from '../../../../pages/common/dimage'
const xiaoqi = process.env.remoteImgPreUrl + '/images/subPackageEco/answer/xiaoqi.png';

@connect(({ answer }) => ({
    ...answer,
}))

class AnswerDetail extends Component<AnswerDetailProps, AnswerDetailState> {
    config: Config = {
        navigationBarTitleText: '趣味答题'
    }
    constructor(props: AnswerDetailProps) {
        super(props)
        this.state = {
            id: '',
            detail: {
                content: '',
                createByName: '',
                endTime: '',
                startTime: '',
                title: '',
                createByCover: ''
            }
        }
    }

    componentDidMount() {
        this.getPartakeDetail();
    }

    componentWillMount() {
        this.setState({
            id: this.$router.params.id
        });
    }

    getPartakeDetail() {
        const { dispatch } = this.props;
        dispatch({
            type: 'answer/getPartakeDetail',
            payload: {
                id: this.state.id
            },
            callback: res => {
                if (res.code == 1) {
                    const { content, createByName, endTime, startTime, title, createByCover } = res.data;
                    this.setState({
                        detail: {
                            content,
                            createByName,
                            endTime,
                            startTime,
                            title,
                            createByCover
                        }
                    });

                    console.log(this.state.detail);

                    return false;
                }

                Taro.showToast({
                    title: '加载出错',
                    image: '../../../images/toastError.png',
                    duration: 2000
                });
            }
        });
    }

    toStartAnswer() {
        Taro.navigateTo({
            url: `/subPackageEco/pages/answer/startAnswer/index?id=${this.state.id}`
        })
    }

    render() {
        const { detail } = this.state
        return (
            <View className='answerDetail-wrap'>
                <Image className='headImg' src='http://saas-2-min-pro.oss-cn-hangzhou.aliyuncs.com/images/subPackageEco/answer/head.png' mode='widthFix' />
                <View className="container">
                    <View className='user-head'>
                        <Dimage src={detail.createByCover} mode='widthFix' type='avatar'
                            styleValue='width: 80rpx;height: 80rpx;border-radius: 50%;margin-right: 32rpx;' />
                        <Text>发起答题者</Text>
                        <Text className='user-name'>{detail.createByName}</Text>
                        <Image className='xiaoqi' src={xiaoqi} mode='widthFix' />
                    </View>

                    <View className='question-title'>
                        {detail.title}
                    </View>
                    <View className='question-info'>
                        {detail.content}
                    </View>
                    {
                        detail &&
                        <View className='question-time'>
                            {formatDate(detail.startTime, 'yyyy.MM.dd')} ~ {formatDate(detail.endTime, 'yyyy.MM.dd')}
                        </View>
                    }
                    <View className='question-btn'>
                        <View className='btn' onClick={this.toStartAnswer.bind(this)}>开始答题</View>
                    </View>
                </View>
            </View>
        )
    }
}

export default AnswerDetail
