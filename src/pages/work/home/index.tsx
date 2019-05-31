import Taro, { Component, Config } from "@tarojs/taro";
import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtGrid, AtIcon } from "taro-ui"
import { HomeProps, HomeState } from "./home.interface";
import { View, Text, Image, Label, Swiper, SwiperItem, Button } from "@tarojs/components";
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import "./home.scss";
// import { } from '../../components'

const tokenKey = process.env.tokenKey

@connect(({ workHome }) => ({
    ...workHome,
}))
class Home extends Component<HomeProps, HomeState> {
    config: Config = {
        navigationBarTitleText: "党务"
    };
    constructor(props: HomeProps) {
        super(props);
        this.state = {
            partyWorks: [],
            hiddenModal: false,
        };
    }

    componentDidMount() {
        this.setState({
            partyWorks: [
                {
                    url: '/subPackageWork/pages/meeting/meetManageList/index',
                    image:
                        "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png",
                    value: "组织生活"
                },
                {
                    url: '/subPackageWork/pages/meeting/meetManageList/index',
                    image:
                        "https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png",
                    value: "工作协同"
                },
                {
                    url: '/subPackageWork/pages/meeting/meetManageList/index',
                    image:
                        "https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png",
                    value: "知识考查"
                },
                {
                    url: '/subPackageWork/pages/meeting/meetManageList/index',
                    image:
                        "https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png",
                    value: "我的党费"
                },
                {
                    url: '/subPackageWork/pages/transfer/list/index',
                    image:
                        "https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png",
                    value: "党员调动"
                },
                {
                    image:
                        "https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png",
                    value: "手机馆"
                }
            ]
        });

        this.checkLoginStaus()
    }

    /** 检查登录状态 */
    checkLoginStaus = () => {
        const storageData = Taro.getStorageSync(tokenKey)
        if(storageData) {
        } else {
            switch(Taro.getEnv()) {
                case 'WEAPP': {
                    this.setState({
                        hiddenModal: true,
                    }, () => {
                        this.setState({
                            hiddenModal: true,
                        })
                    })
                    break;
                }
                case 'ALIPAY': {
                    this.setState({
                        hiddenModal: false
                    }, () => {
                        this.setState({
                            hiddenModal: false,
                        })
                    })
                    this.onLoginByAlipay()
                    break;
                }
                default:
                    break;
            }
        }
    }

    /** 微信登录 */
    onLoginByWeapp = (e:Event) => {
        e.stopPropagation()
        this.setState({
            hiddenModal: false
        }, () => {
            this.setState({
                hiddenModal: false,
            })
        })
        Taro.login({
            success: (res) => {
                console.warn(res)
                if(res.code) {
                    this.postLogin(res.code)
                } else {

                }
            }
        })
    }

    /** 支付宝登录 */
    onLoginByAlipay = () => {
        my.getAuthCode({
            scopes: 'auth_user',
            success: (res) => {
                console.warn(res)
                if(res.authCode) {
                    this.postLogin(res.authCode)
                } else {

                }
            }
        })
    }

    /** 发起请求 */
    postLogin = (authCode:string) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'workHome/login',
            payload: {
                code: authCode
            }
        });    
    }

    onClickManagerWork = (item, index) => {
        Taro.navigateTo({
            url: item.url
        })
    }

    render() {
        const { partyWorks, hiddenModal } = this.state;
        return (
            <View className='user-home-wrap'>
                <AtModal isOpened={hiddenModal}>
                    <AtModalHeader>提示</AtModalHeader>
                        <AtModalContent>第一次使用，我们需要申请授权</AtModalContent>
                    <AtModalAction> 
                        <Button
                            className="authorization"
                            open-type='getUserInfo' 
                            onGetUserInfo={this.onLoginByWeapp.bind(this)}
                        >
                            授权
                        </Button> 
                    </AtModalAction>
                </AtModal>
                <View className='user-home-infoCard'>
                    <View className='headerInfo'>
                        <Image
                          src=''
                          mode='aspectFit'
                          onError={e => {
                                console.warn("imgError", e);
                            }}
                          className='imgHeader'
                        />
                        <View>
                            <View className='nickName'>昵称</View>
                            <View className='partyName'>***党支部 {process.env.remoteImgPreUrl}</View>
                        </View>
                    </View>
                    <View className='userCore'>
                        <View className='score'>
                            <Text>150</Text>
                            个人积分
                        </View>
                        <View className='activeValue'>
                            <Label>↑</Label>
                            <Text>120</Text>
                            活跃值
                        </View>
                    </View>
                </View>
                <View className='toDoWork'>
                    <View className='header'>待办事项</View>
                    <View className='works'>
                        <View className='workItem active'>关于2018年 民主评议</View>
                    </View>
                </View>
                <View className='partyWorks'>
                    <View className='header'>党务工作</View>
                    <AtGrid columnNum={4} hasBorder={false} data={partyWorks} onClick={this.onClickManagerWork} />
                </View>
                <View className='partyDay'>
                    <View className='header'>入党纪念 <Text className='subHeader'>近期有20名党员过“政治生日”送上祝福</Text></View>
                    <Swiper className='userHeaderPicSwiper' displayMultipleItems={5}>
                    {
                        partyWorks.map((user) => {
                            return (
                                <SwiperItem key={user.value} className='userSwiperItem active' >
                                    <Image
                                      src={user.image}
                                      mode='aspectFit'
                                      onError={e => {
                                            console.warn("imgError", e);
                                        }}
                                      className='imgPartyDayUserHeader'
                                    />
                                    <View className='patyDayUserName'>{user.value}</View>
                                    <View className='patyDayUserDay'>{user.value}</View>
                                </SwiperItem>
                            )
                        })
                    }
                    </Swiper>
                </View>
                <View className='eco'>
                    <View className='header'>推荐学习</View>
                    <View className='ecoText'>
                        <View className='ecoItem active'>
                            <Image
                              src={partyWorks[0].image}
                              mode='aspectFit'
                              onError={e => {
                                    console.warn("imgError", e);
                                }}
                              className='imgEcoText'
                            />
                            <View>
                                <View className='title'>学习习近平总书记系列讲话精神干部读本</View>
                                <View className='subTitle'>以八项规定为切入口，八项规定给党风政风社会风气带来的变化</View>
                                <View className='desc'>
                                    <Text>1人</Text>
                                    已看
                                </View>
                            </View>
                        </View>
                        <View className='ecoItem active'>
                            <Image
                              src={partyWorks[0].image}
                              mode='aspectFit'
                              onError={e => {
                                    console.warn("imgError", e);
                                }}
                              className='imgEcoText'
                            />
                            <View>
                                <View className='title'>学习习近平总书记系列讲话精神干部读本</View>
                                <View className='subTitle'>以八项规定为切入口，八项规定给党风政风社会风气带来的变化</View>
                                <View className='desc'>
                                    <Text>1人</Text>
                                    已看
                                </View>
                            </View>
                        </View>
                    </View>
                    <View className='ecoVideo'>
                        <View className='ecoItem active'>
                            <View className='ecoVideoImg'>
                                <Image
                                  src={partyWorks[0].image}
                                  mode='aspectFit'
                                  onError={e => {
                                        console.warn("imgError", e);
                                    }}
                                  className='imgEcoVideo'
                                />
                                <Text className='imgEcoVideoDesc'>视频</Text>
                            </View>
                            <View className='title'>学习习近平总书记系列讲话精神干部读本</View>
                        </View>
                        <View className='ecoItem active'>
                            <View className='ecoVideoImg'>
                                <Image
                                  src={partyWorks[0].image}
                                  mode='aspectFit'
                                  onError={e => {
                                        console.warn("imgError", e);
                                    }}
                                  className='imgEcoVideo'
                                />
                                <Text className='imgEcoVideoDesc'>视频</Text>
                            </View>
                            <View className='title'>学习习近平总书记系列讲话精神干部读本</View>
                        </View>
                        <View className='ecoItem active'>
                            <View className='ecoVideoImg'>
                                <Image
                                  src={partyWorks[0].image}
                                  mode='aspectFit'
                                  onError={e => {
                                        console.warn("imgError", e);
                                    }}
                                  className='imgEcoVideo'
                                />
                                <Text className='imgEcoVideoDesc'>视频</Text>
                            </View>
                            <View className='title'>学习习近平总书记系列讲话精神干部读本</View>
                        </View>
                        <View className='ecoItem active'>
                            <View className='ecoVideoImg'>
                                <Image
                                  src={partyWorks[0].image}
                                  mode='aspectFit'
                                  onError={e => {
                                        console.warn("imgError", e);
                                    }}
                                  className='imgEcoVideo'
                                />
                                <Text className='imgEcoVideoDesc'>视频</Text>
                            </View>
                            <View className='title'>学习习近平总书记系列讲话精神干部读本</View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default Home;
