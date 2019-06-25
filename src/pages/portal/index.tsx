/**
 * 1. 取地址参数看有没有redirect,有redirect跳redirect，没有则默认work/home/index
 * 2. 将redirect（没有为空）统一调用免登接口验证
 * 3. 根据免登返回参数判断是否需要绑定，无需绑定直接进入redirect，需绑定跳绑定页
 */

import Taro, { Component, Config } from "@tarojs/taro";
import { AtInput, AtButton } from "taro-ui"
import { IProps, IState } from "./index.interface";
import { View, Text, Image, Label, Swiper, SwiperItem, Button } from "@tarojs/components";
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import "./index.scss";
import { INoLoginRes } from "@/src/service/loginService";
import { IResponse } from "types/IResponse";
// import { } from '../../components'

/** 默认进入后的跳转页 */
const defaultRedirect = '/pages/work/home/index'
@connect(({ portal, loading }) => ({
    ...portal,
    loading,
}))
class Portal extends Component<IProps, IState> {
    config: Config = {
        navigationBarTitleText: "党建云"
    };
    constructor(props: IProps) {
        super(props);
        this.state = {
            redirect: defaultRedirect
        }
    }

    componentDidMount() {
        const params = this.$router.params
        if(params) {
            // 获取需跳转页面，没有就默认跳党务
            this.setState({
                redirect: params.redirect || defaultRedirect
            })
        }
        this.checkAppType();
    }

    /** 获取系统配置项 */
    getSysDic = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'portal/getSysDic',
        })
    }

    /** 检测当前登录入口类型，取出小程序授权code */
    checkAppType = () => {
        let appType:string = Taro.getEnv()
        let authCode = ''
        // 检测是否能升级支付宝，能就是支付宝否则是钉钉
        if(appType === 'ALIPAY') {
            if(!Taro.canIUse('ap.updateAlipayClient')) {
                appType = 'DINGTALK'
            }
            
            my.getAuthCode({
                scopes: 'auth_user',
                success: (res) => {
                    authCode = res.authCode || ''
                    this.setState({
                        appType,
                        authCode,
                    });
                    // 免登
                    this.toNoLogin(appType, authCode);
                }
            })
        }
        else if(appType === 'WEAPP') {
            Taro.login({
                success: (res) => {
                    authCode = res.code || ''
                    this.setState({
                        appType,
                        authCode,
                    });
                    // 免登
                    this.toNoLogin(appType, authCode);
                },
                fail: (res) => {
                    console.error(res)
                }
            })
        }
    }

    /** 免登，检查redirect跳转 */
    toNoLogin = (appType, authCode) => {
        const { dispatch } = this.props
        const { redirect } = this.state
        dispatch({
            type: 'portal/noLogin',
            payload: {
                redirect,
                appType,
                authCode,
            },
            callback: (res:IResponse<INoLoginRes>) => {
                const { code, data } = res
                
                if(code === 1) {
                    Taro.setStorageSync(process.env.tokenKey, data.token)
                    Taro.setStorageSync(process.env.tokenKey + '_userInfo', data)
                    // 获取 系统配置项、数据字典
                    this.getSysDic();
                    if(data.isRedirect === 0) {
                        
                        // 允许直接跳转到目标页面
                        const switchTabPages = ['/pages/work/home/index', '/pages/news/home/index', '/pages/aiHelper/home/index', '/pages/eco/home/index', '/pages/user/home/index']
                        const findTabPageIndex = switchTabPages.findIndex(page => {
                            console.warn(redirect.indexOf(page))
                            return redirect.indexOf(page) > -1
                        })

                        if(findTabPageIndex > -1) {
                            Taro.switchTab({
                                url: decodeURIComponent(redirect)
                            })
                        } else {
                            Taro.redirectTo({
                                url: decodeURIComponent(redirect)
                            })
                        }
                    } else {
                        // 需先绑定再跳转
                        Taro.redirectTo({
                            url: `/pages/bindAccount/index?redirect=${redirect}`
                        })
                    }

                } else {

                }
            }
        })
    }

    render() {

        return (
            <View className='portal'>
                <View className="title">
                    portal页面
                </View>
            </View>
        );
    }
}

export default Portal;
