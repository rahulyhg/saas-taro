import Taro, { Component, Config } from "@tarojs/taro";
import { AtGrid, AtIcon, AtBadge } from "taro-ui"
import Dimage from '@/src/pages/common/dimage'
import { HomeProps, HomeState } from "./home.interface";
import { View, Text, Image, Label, Swiper, SwiperItem, Button } from "@tarojs/components";
import { connect } from '@tarojs/redux'
import { Request } from '@/src/utils/request'
// import Tips from '../../utils/tips'
import "./home.scss";
const demoImg = 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1'
 + '561120653&di=237bf1b14ff6f93f2dd49580f5666236&src=http://pic33.nipic.com/20130924/9822353_015119969000_2.jpg';
// import { } from '../../components'

@connect(({ workHome, appraise }) => ({
    ...workHome,
    ...appraise,
}))
class Home extends Component<HomeProps, HomeState> {
    config: Config = {
        navigationBarTitleText: "党务"
    };
    constructor(props: HomeProps) {
        super(props);
        this.state = {
            userInfo: Request.getUserInfo(),
            userWorks: [
                {
                    url: '/subPackageWork/pages/meeting/meetUserList/index',
                    image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
                    value: '组织生活'
                },
                {
                    url: '/pages/subDemo/demo1/index',
                    image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
                    value: '组织架构'
                },
                {
                    url: '',
                    image:
                        "https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png",
                    value: "民主评议"
                },
            ],
            partyWorks: [
                {
                    url: '/subPackageWork/pages/meeting/meetManageList/index',
                    image:
                        "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png",
                    value: "组织生活"
                },
                {
                    url: '/subPackageWork/pages/coordination/coordinationList/index',
                    image:
                        "https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png",
                    value: "工作协同"
                },
                {
                    url: '/subPackageWork/pages/exam/examList/index',
                    image:
                        "https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png",
                    value: "知识考查"
                },
                {
                    url: '/subPackageWork/pages/dues/index/index',
                    image:
                        "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png",
                    value: "我的党费"
                },
                {
                    url: '/subPackageWork/pages/transfer/index/index',
                    image:
                        "https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png",
                    value: "党员调动"
                },
                {
                    url: '/subPackageWork/pages/rewardsPunishments/list/index',
                    image:
                        "https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png",
                    value: "奖惩"
                },
                {
                    url: '/subPackageWork/pages/turnover/list/index',
                    image:
                        "https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png",
                    value: "党员流动"
                },
                {
                    url: '/subPackageWork/pages/assessment/list/index',
                    image:
                        "https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png",
                    value: "考核申报"
                },
            ],
            hiddenModal: false,
        };
    }

    componentDidMount() {
        const params = this.$router.params;
    }

    onClickUserWork = (item, e) => {
        Taro.navigateTo({
            url:item.url
        })
    }

    onClickManagerWork = (item, e) => {
        if(item.value !== '民主评议') {
            Taro.navigateTo({
                url:item.url
            })
            return
        }
        
        // 判断跳转页面
        const { dispatch } = this.props;

        dispatch({
            type: `appraise/getAppraiseState`,
            payload: {},
            callback: res => {
                const { code, data: {state, id, size} } = res;

                if(code !== 1) {
                    return
                }
                
                switch( state ) {
                    case '0':
                        Taro.showToast({
                            title: '民主评议未开始',
                            icon: 'none',
                            duration: 2000
                        });
                        break;
                    case '1':
                        Taro.navigateTo({
                            url: `/subPackageWork/pages/appraise/self/index?id=${ id }&size=${ size }`
                        });

                        break;
                    case '2':
                        Taro.navigateTo({
                            url: `/subPackageWork/pages/appraise/other/index?id=${ id }&size=${ size }`
                        });
                        
                        break;
                    case '3':
                        Taro.navigateTo({
                            url: `/subPackageWork/pages/appraise/result/index?id=${ id }&size=${ size }`
                        });
                        
                        break;
                    default:
                        Taro.navigateTo({
                            url: '/subPackageWork/pages/appraise/list/index'
                        });

                        break;
                }
            }
        });
    }

    onClickScore = (e:Event) => {
        Taro.navigateTo({
            url: '/subPackageWork/pages/integralRank/index'
        })
    }

    // 跳转积分
    goRecordIndex = () =>{
        Taro.navigateTo({
            url:'/pages/user/recordIndex/index'
        })
    }

    render() {
        const { userWorks, partyWorks, userInfo } = this.state;

        return (
            <View className='work'>
                <View className='work-infoCard'>
                    <View className='waitWork' style={{ backgroundImage: `url(${process.env.remoteImgPreUrl}/images/work/header.png)` }}>
                        <Dimage src={`${process.env.remoteImgPreUrl}/images/work/xiaoQi.png`} mode='aspectFit' />
                        <View>
                            <View>{userInfo.nickName}同志 你有3项工作待处理</View>
                            <AtIcon value='chevron-right' size='30' color='#F00'></AtIcon>
                        </View>
                    </View>
                    <View className='userCore' onClick={this.goRecordIndex.bind(this)}>
                        <View className='header'>
                            <View className='title'>积分排名</View>
                            <View className='link'>查看更多 ＞</View>
                        </View>
                        <View className='scoreCard'>
                            <View className='user active'>
                                <View>
                                    <Text className='score'>1500</Text>
                                    <View className='rank red'>
                                        <AtIcon value='clock' prefixClass='icon icon-paiming' size='12' color='#FF4D4F'></AtIcon>  
                                        第1003名  
                                        <AtIcon value='clock' prefixClass='icon icon-xiajiang' size='12' color='#FF4D4F'></AtIcon>
                                    </View>
                                </View>
                                <Text>
                                    本年度个人积分
                                    <View className='icon icon-shangsheng'></View>
                                </Text>
                            </View>
                            <View className='org active'>
                                <View>
                                    <Text className='score'>1500</Text>
                                    <View className='rank green'>
                                        <AtIcon value='clock' prefixClass='icon icon-paiming' size='12' color='#0BA094'></AtIcon>  
                                        第1005名  
                                        <AtIcon value='clock' prefixClass='icon icon-xiajiang' size='12' color='#0BA094'></AtIcon>
                                    </View>
                                </View>
                                <Text>
                                    本年度组织积分
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                {/* <View className='toDoWork'>
                    <View>
                        <View className='header'>待办事项</View>
                        <View className='works'>
                            <View className='workItem active'>关于2018年 民主评议</View>
                        </View>
                    </View>
                </View> */}
                <View className='partyWorks user'>
                    <View className='header'>个人工作</View>
                    <View className='djGrid'>
                        <View>
                        {
                            userWorks.map(work => {
                                return (
                                    <View key={work.url} className='gridItem item25 active' onClick={this.onClickUserWork.bind(this, work)}>
                                        <View className='gridContent'>
                                            <View className='gridInner'>
                                                <View className='gridImg'>
                                                    <AtBadge value={10} maxValue={99}>
                                                        <Dimage src={work.image} onClick={this.onClickManagerWork.bind(this, work)} />
                                                    </AtBadge>
                                                </View>
                                                <View className='gridText'>
                                                    {work.value}
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                        </View>
                    </View>
                </View>
                {
                    userInfo.isAdmin === 1 ? (
                        <View className='partyWorks manager'>
                            <View className='header'>管理工作</View>
                            <View className='djGrid'>
                                <View>
                                {
                                    partyWorks.map(work => {
                                        return (
                                            <View key={work.url} className='gridItem item25 active' onClick={this.onClickManagerWork.bind(this, work)}>
                                                <View className='gridContent'>
                                                    <View className='gridInner'>
                                                        <View className='gridImg'>
                                                            <AtBadge value={10} maxValue={99}>
                                                                <Dimage src={work.image} onClick={this.onClickManagerWork.bind(this, work)} />
                                                            </AtBadge>
                                                        </View>
                                                        <View className='gridText'>
                                                            {work.value}
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                                </View>
                            </View>
                            {/* <AtGrid columnNum={4} hasBorder={false} data={partyWorks} onClick={this.onClickManagerWork} /> */}
                        </View>
                    ) : ''
                }
                {/* <View className='partyDay'>
                    <View className='header'>入党纪念 <Text className='subHeader'>近期有20名党员过“政治生日”送上祝福</Text></View>
                    <Swiper className='userHeaderPicSwiper' displayMultipleItems={5}>
                    {
                        partyWorks.map((user) => {
                            return (
                                <SwiperItem key={user.value} className='userSwiperItem active imgPartyDayUserHeader' >
                                    <Dimage src={userInfo.avatarUrl} mode='aspectFit' />
                                    <View className='patyDayUserName'>{user.value}</View>
                                    <View className='patyDayUserDay'>{user.value}</View>
                                </SwiperItem>
                            )
                        })
                    }
                    </Swiper>
                </View> */}
                <View className='eco'>
                    <View className='header'>
                        <View className='title'>视频推荐</View>
                        <View className='link'>更多 </View>
                    </View>
                    {/* <View className='ecoText'>
                        <View className='ecoItem active imgEcoText'>
                            <Dimage src='' mode='aspectFit' />
                            <View>
                                <View className='title'>学习习近平总书记系列讲话精神干部读本</View>
                                <View className='subTitle'>以八项规定为切入口，八项规定给党风政风社会风气带来的变化</View>
                                <View className='desc'>
                                    <Text>1人</Text>
                                    已看
                                </View>
                            </View>
                        </View>
                        <View className='ecoItem active imgEcoText'>
                            <Dimage src='' mode='aspectFit' />
                            <View>
                                <View className='title'>学习习近平总书记系列讲话精神干部读本</View>
                                <View className='subTitle'>以八项规定为切入口，八项规定给党风政风社会风气带来的变化</View>
                                <View className='desc'>
                                    <Text>1人</Text>
                                    已看
                                </View>
                            </View>
                        </View>
                    </View> */}
                    <View className='ecoVideo'>
                        {
                            [{},{},{},{},{},{},{},{}].map((item, index)=>{
                                return (
                                    <View className={`ecoItem active imgEcoVideo ${index%2==0?'ecoPadR20':'ecoPadL20'}`}>
                                        <View className='ecoVideoImg'>
                                            <Dimage src={demoImg} mode='aspectFit' />
                                            <Text className='imgEcoVideoDesc'>视频</Text>
                                        </View>
                                        <View className='title'>学习习近平总书记系列讲话精神干部读本</View>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
                <View className='eco learn'>
                    <View className='header'>
                        <View className='title'>专题教育</View>
                        <View className='link'>更多 </View>
                    </View>
                    <View className='content'>
                        <View className='ecoItem active imgEcoLearn'>
                            <View className='ecolearnImg'>
                                <Dimage src={demoImg} mode='aspectFit' />
                            </View>
                            <View className='title'>学习习近平总书记系列讲话精神干部读本</View>
                        </View>
                    </View>
                </View>
                <View className='eco book'>
                    <View className='header'>
                        <View className='title'>书籍推荐</View>
                        <View className='link'>更多</View>
                    </View>
                    <View className='content'>
                        <View className='ecoItem active imgBook'>
                            <View className='ecoVideoImg'>
                                <Dimage src={demoImg} mode='aspectFit' />
                            </View>
                            <View className='title'>小程序从开始到结束</View>
                        </View>
                        <View className='ecoItem active imgBook' style={{ margin: '0 88rpx' }}>
                            <View className='ecoVideoImg'>
                                <Dimage src={demoImg} mode='aspectFit' />
                            </View>
                            <View className='title'>java从入门到放弃</View>
                        </View>
                        <View className='ecoItem active imgBook'>
                            <View className='ecoVideoImg'>
                                <Dimage src={demoImg} mode='aspectFit' />
                            </View>
                            <View className='title'>mysql从删库到跑路</View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
export default Home;