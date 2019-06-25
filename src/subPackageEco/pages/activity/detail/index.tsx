import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image, Block } from '@tarojs/components'
import { AtButton } from "taro-ui";
import { connect } from '@tarojs/redux'
import Dimage from '../../../../pages/common/dimage'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { ActivityDetailProps, ActivityDetailState } from './index.interface'
import './index.scss'
// import {  } from '../../components'
import { dateFormat } from "../../../../utils/common"
import DjLoading from '@/src/pages/common/djLoading';
@connect(({ activityDetail, loading }) => ({
    ...activityDetail,
    loading: loading.models.activityDetail
}))

class Signup extends Component<ActivityDetailProps, ActivityDetailState> {
    config: Config = {
        navigationBarTitleText: '活动详情'
    }
    constructor(props: ActivityDetailProps) {
        super(props)
        this.state = {
            partyWorks: []
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'activityDetail/getActivityById',
            payload: {
                id: this.$router.params.id
            }
        })
        this.setState({
            partyWorks: [

            ]
        });
    }

    dateFormat = (e, t) => {
        var n = new Date(e), r = {
            "M+": n.getMonth() + 1,
            "d+": n.getDate(),
            "h+": n.getHours(),
            "m+": n.getMinutes(),
            "s+": n.getSeconds(),
            "q+": Math.floor((n.getMonth() + 3) / 3),
            S: n.getMilliseconds()
        };
        /(y+)/.test(t) && (t = t.replace(RegExp.$1, (n.getFullYear() + "").substr(4 - RegExp.$1.length)));
        for (var o in r) new RegExp("(" + o + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? r[o] : ("00" + r[o]).substr(("" + r[o]).length)));
        return t;
    }

    // 页面分享事件
    onShareAppMessage() {
        const { activityDetail } = this.props;
        return {
            title: activityDetail.title,
            path: '/subPackageEco/pages/activity/detail/index?id=' + this.$router.params.id,
            imageUrl: 'http://djimages.71dj.org/' + activityDetail.cover
        }
    }

    // 我要报名
    goSignUp() {
        const nowdate = dateFormat(new Date(), 'yyyy-MM-dd');
        const startTime = dateFormat(this.props.activityDetail.startTime, 'yyyy-MM-dd');
        const endTime = dateFormat(this.props.activityDetail.endTime, 'yyyy-MM-dd');
        console.error(nowdate, startTime, endTime);
        if (nowdate < startTime) {
            Taro.showToast({
                title: "活动尚未开始",
                icon: 'none'
            });
            return false
        }
        if (nowdate > endTime) {
            Taro.showToast({
                title: "活动已结束",
                icon: 'none'
            });
            return false
        }
        Taro.navigateTo({
            url: '/subPackageEco/pages/activity/signUp/index?id=' + this.$router.params.id
        })
    }

    // 查看更多
    goMore() {
        Taro.navigateTo({
            url: '/subPackageEco/pages/activity/staffList/index?id=' + this.$router.params.id
        })
    }

    // 回到顶部
    pageScroll = e => {
        Taro.pageScrollTo({
            scrollTop: 0,
            duration: 300
        })
    }

    render() {
        const { activityDetail, loading } = this.props;
        console.error(activityDetail)
        return (
            <View className='activityDetail signup-wrap'>
                {
                    !loading &&
                    <Block>
                        <Image src={'http://djimages.71dj.org/' + activityDetail.cover} className='imgSwiper' mode='widthFix' />

                        <View className="header">
                            <View className="title">
                                {activityDetail.title}
                            </View>
                            <View className="subTitle">
                                <View className="name">
                                    <Text>{activityDetail.createName} | 报名活动</Text>
                                </View>
                                <View className="time">
                                    <Text>{this.dateFormat(`${activityDetail.endTime}`, 'yyyy年MM月dd日')}</Text> 截止</View>
                            </View>
                            <View className="joinUsers">
                                <View className="top">
                                    <View className="title">报名人员<Text>{activityDetail.attendNum}人已报名</Text></View>
                                    <View className="link" onClick={this.goMore.bind(this)}>查看更多</View>
                                </View>

                                {<View className='at-row at-row--wrap'>
                                    {
                                        activityDetail.userList && activityDetail.userList.map((user, index) => {
                                            return (

                                                <View className='at-col at-col-2'>
                                                    <Dimage src={user.avatar} type='avatar' />
                                                    <View className='user-name'>{user.personName.substr(0, 3)}</View>
                                                </View>


                                            )
                                        })
                                    }

                                </View>
                                }

                            </View>
                        </View>

                        <View className="body">
                            <View className="title">活动详情</View>
                            <View className="time">
                                <View>活动开始时间：{activityDetail.startTime}</View>
                                <View>活动结束时间：{activityDetail.endTime}</View>
                            </View>
                            <View className="content">
                                {activityDetail.content}
                            </View>
                        </View>

                        <View className="footer">
                            <AtButton type="secondary" size="normal" openType='share'>我要分享</AtButton>
                            {
                                !activityDetail.usedJoin && <AtButton onClick={this.goSignUp.bind(this)} className="last" type="primary" size="normal">我要报名</AtButton>
                            }

                        </View>

                        <Image
                            src={`${process.env.remoteImgPreUrl}/images/scrollTop.png`}
                            mode='aspectFit'
                            onError={e => {
                            }}
                            className='scorllBack'
                            onClick={this.pageScroll}
                        />

                    </Block>

                }

                <DjLoading isshow={loading} />
            </View>
        )
    }
}

export default Signup
