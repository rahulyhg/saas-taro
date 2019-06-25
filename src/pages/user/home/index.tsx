// eslint-disable-next-line
import Taro, { Component, Config } from "@tarojs/taro";
import { IProps, IState } from "./interface";
import { View, Text, Image, Label, Swiper, SwiperItem } from "@tarojs/components";
import { AtGrid, AtIcon, AtList, AtListItem } from "taro-ui";
import Dimage from '../../../pages/common/dimage'
import { connect } from '@tarojs/redux'
import "./home.scss";
const remoteImgPreUrl = process.env.remoteImgPreUrl

@connect(({ userHome }) => ({
    ...userHome,
}))
class UserHome extends Component<IProps, IState> {
    config: Config = {
        navigationBarTitleText: "我的"
    };
    constructor(props: IProps) {
        super(props);
        this.state = {
            gridMenus: [
                {
                    title: '我的收藏',
                    icon: 'myCollectIcon',
                    url: '/subPackageUser/pages/myCollection/index',
                },
                {
                    title: '我的点赞',
                    icon: 'myLikeIcon',
                    url: '/subPackageUser/pages/myLike/index',
                },
                {
                    title: '我的评论',
                    icon: 'myCommentIcon',
                    url: '/subPackageUser/pages/myComment/index',
                },
                {
                    title: '我的活动',
                    icon: 'myActivityIcon',
                    url: '/subPackageUser/pages/myActivity/index',
                },
            ],
            menus: [
                {
                    title: '我的组织',
                    icon: 'icon-wodezuzhi',
                    iconColor: '#FF7060',
                    subIcon: 'icon-erweima',
                    url: '/pages/user/org/index',
                },
                {
                    title: '我的历程',
                    icon: 'icon-wodelicheng',
                    iconColor: '#18B5FD',
                    subTitle: '我的历程都在这',
                    url: '/pages/user/course/index',
                },
                {
                    title: '我的党费',
                    icon: 'icon-wodedangfei',
                    iconColor: '#FDAB18',
                    url: '',
                },
                {
                    title: '扫一扫',
                    icon: 'icon-saoyisao',
                    iconColor: '#FF7060',
                    subIcon: 'qrcode',
                    onClick: ():any => {
                        console.warn('扫一扫')
                    }
                },
                {
                    title: '消息通知',
                    icon: 'icon-xiaoxitongzhi',
                    iconColor: '#FDAB18',
                    url: '/subPackageUser/pages/notice/index',
                },
                {
                    title: '建议反馈',
                    icon: 'icon-jianyifankui',
                    iconColor: '#00D9E8',
                    url: '/subPackageUser/pages/myFeedback/index',
                },
                {
                    title: '关于我们',
                    icon: 'icon-guanyuwomen',
                    iconColor: '#FF7060',
                    url: '/subPackageUser/pages/about/index',
                }
            ]
        };
    }

    componentDidMount() {

    }

    toPage(url: string) {
        Taro.navigateTo({url});
    }

    render() {
        const { gridMenus, menus } = this.state;
        
        return (
            <View className='user'>
                <View className='user-info'>
                    <Dimage type='avatar' src='#' styleValue='width: 120rpx;height: 120rpx;border-radius: 50%;margin-right: 32rpx;' />
                    <View>
                        <View className='user-info-main'>
                            <Text className='user-info-name'>张明明</Text>
                            <Text className='user-info-date'>
                                <AtIcon prefixClass='icon icon-riqi' value='chevron-right' size='14' color='#fff'></AtIcon>
                                2016.10.20
                            </Text>
                        </View>
                        <View className='user-info-org'>智慧城市党建支部</View>
                    </View>
                    <View className='user-info-icon'>
                        <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='16' color='#fff'></AtIcon>
                    </View>
                </View>

                <View className='user-action'>
                    {
                        gridMenus.map(item => {
                            return (
                                <View className='user-action-item' onClick={ this.toPage.bind(this, item.url) }>
                                    <Image src={`${ remoteImgPreUrl }images/user/${ item.icon }.png`} />
                                    <View>{item.title}</View>
                                </View>
                            )
                        })
                    }
                </View>

                <View className='user-menuList'>
                    {
                        menus.map(item => {
                            return (
                                <View className='user-menuList-item' onClick={item.url ? this.toPage.bind(this, item.url) : item.onClick }>
                                    <View className='list-icon'>
                                        <AtIcon prefixClass={`icon ${item.icon}`} value='chevron-right' size='20' color={item.iconColor}></AtIcon>
                                    </View>
                                    <View className='list-main'>
                                        <View className='list-main-title'>{ item.title }</View>
                                        <View className='list-main-content'>
                                            { item.subTitle }
                                            { 
                                                item.subIcon &&
                                                <AtIcon prefixClass={`icon ${item.subIcon}`} value='chevron-right' size='16' color='#ccc'></AtIcon>
                                            }
                                        </View>
                                        <View className='list-main-icon'>
                                            <AtIcon prefixClass='icon icon-youjiantou' value='chevron-right' size='14' color='#ccc'></AtIcon>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                    
                </View>
            </View>
        );
    }
}

export default UserHome;
