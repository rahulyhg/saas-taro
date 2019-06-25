import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AnswerDetailProps, AnswerDetailState } from './index.interface'
import './index.scss'
import { formatDate } from '../../../../utils/common'
import Dimage from '../../../../pages/common/dimage'
import DjLoading from '../../../../pages/common/djLoading/index'
const xiaoqi = process.env.remoteImgPreUrl + '/images/subPackageEco/answer/xiaoqi.png';
const apiBackImgPre = process.env.apiBackImgPre;
const remoteImgPreUrl = process.env.remoteImgPreUrl;

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
                createByCover: '',    
            },
            loading: true,
            isError: false
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
                            createByCover: apiBackImgPre + createByCover
                        }
                    });

                    return false;
                }

                this.setState({
                    isError: true,
                    loading: false
                });

                Taro.showToast({
                    title: '加载出错',
                    icon: 'none',
                    duration: 2000
                }).then(() => {
                    Taro.navigateBack({
                        delta: 1
                    });
                });
            }
        });
    }

    toStartAnswer() {
        Taro.navigateTo({
            url: `/subPackageEco/pages/answer/startAnswer/index?id=${this.state.id}`
        })
    }

    // 页面分享事件
    onShareAppMessage() {
        const { title } = this.props;
        const redirect = encodeURIComponent(`/subPackageEco/pages/answer/detail/index?id=${this.$router.params.id}`);
        return {
            title: title,
            path: `/pages/portal/index?redirect=${redirect}`,
            imageUrl: process.env.remoteImgPreUrl + 'images/common/shareDefaultImg.png'
        }
    }

    render() {
        const { detail, isError, loading } = this.state;
        return (
            <View className='answerDetail-wrap'>
                <Image className='headImg' src='http://saas-2-min-pro.oss-cn-hangzhou.aliyuncs.com/images/subPackageEco/answer/head.png' mode='widthFix' />
                <View className="container">
                    <View className='user-head'>
                        <Dimage src={ detail.createByCover } mode='aspectFit' type='avatar'
                            styleValue='height: 80rpx;width: 80rpx; border-radius: 50%;margin-right: 32rpx;'>
                        </Dimage>
                        <Text>发起答题者</Text>
                        <Text className='user-name'>{detail.createByName}</Text>
                        <Image className='xiaoqi' src={xiaoqi} mode='widthFix' />
                    </View>

                    <View className='question-title'>
                        {detail.title}
                    </View>
                    <View className='question-info'>
                        {detail.content ? detail.content : '暂无活动描述'}
                    </View>
                    {
                        detail &&
                        <View className='question-time'>
                            {formatDate(detail.startTime, 'yyyy.MM.dd')} ~ {formatDate(detail.endTime, 'yyyy.MM.dd')}
                        </View>
                    }
                    {
                        !isError && 
                        <View className='question-btn'>
                            <View className='btn' onClick={this.toStartAnswer.bind(this)}>开始答题</View>
                        </View>
                    }
                    
                </View>

                <DjLoading isshow={loading} />
            </View>
        )
    }
}

export default AnswerDetail
