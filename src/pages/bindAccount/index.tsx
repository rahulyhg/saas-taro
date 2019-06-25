import Taro, { Component, Config } from "@tarojs/taro";
import { AtInput, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import { IProps, IState } from "./index.interface";
import { View, Text, Image, Label, Swiper, SwiperItem, Button } from "@tarojs/components";
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import "./index.scss";
import { INoLoginRes } from "@/src/service/loginService";
import { Request } from '../../utils/request'
import { IResponse } from "types/IResponse";
// import { } from '../../components'

@connect(({ bindAccount, portal, loading }) => ({
    ...bindAccount,
    portal,
    loading: loading.effects['bindAccount/submit'],
}))
class BindAccount extends Component<IProps, IState> {
    config: Config = {
        navigationBarTitleText: "绑定账号"
    };
    constructor(props: IProps) {
        super(props);
        this.state = {
            bindType: 'phone',
            phone: '',
            verificationCode: '1234',
            account: '',
            password: '',
            timer: 0,
            hiddenModal: false,
        };
    }

    componentDidMount() {
        const { portal } = this.props

        const params = this.$router.params
        if(params) {
            // 获取需跳转页面，没有就默认跳党务
            this.setState({
                redirect: params.redirect
            })
        }

        // 根据入口类型，获取对应code和用户信息
        if(portal.appType === 'WEAPP') {
            this.setState({
                hiddenModal: true
            })
        } else {
            this.onLoginByAlipay()
        }
    }

    /** 切换绑定方式 */
    onChangeBindType = (bindType, e:Event) => {
        this.setState({
            bindType: bindType
        })
    }

    onChangePhone = (value) => {
        this.setState({
            phone: value
        })
    }

    onChangeVerificationCode = (value) => {
        this.setState({
            phone: value
        })
    }

    onChangeAccount = (value) => {
        this.setState({
            account: value
        })
    }

    onChangePassword = (value) => {
        this.setState({
            password: value
        })
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

        const userInfo = e.detail.userInfo
        Taro.login({
            success: (res) => {
                if(res.code) {
                    this.setState({
                        userInfo: {
                            authCode: res.code,
                            nickName: userInfo.nickName,
                            avatarUrl: userInfo.avatarUrl,
                        }
                    })
                }
            }
        })
    }

    /** 支付宝登录 */
    onLoginByAlipay = () => {
        my.getAuthCode({
            scopes: 'auth_user',
            success: (res) => {
                if(res.authCode) {
                    this.setState({
                        userInfo: {
                            authCode: res.authCode,
                        }
                    })
                }
            }
        })
    }

    /** 发起绑定 */
    onSubmitBind = async () => {
        const userData = Request.getUserInfo()
        const { dispatch, portal } = this.props
        const { phone, verificationCode, account, password, userInfo, redirect } = this.state
        await dispatch({
            type: 'bindAccount/submit',
            payload: {
                miniOpenid: userData.miniOpenid,
                phone: phone,
                activeCode: verificationCode,
                account: account,
                password: password,
                terminal: portal.appType
            },
            callback: (res:IResponse<INoLoginRes>) => {
                const { code, data } = res
                if(code === 1) {
                    const { token } = userData
                    const newUserInfo = {
                        ...userData,
                        ...data,
                        ...userInfo,
                        token,
                    }
                    Taro.setStorageSync(`${process.env.tokenKey}`, token)
                    Taro.setStorageSync(`${process.env.tokenKey}_userInfo`, newUserInfo)

                    const switchTabPages = ['/pages/work/home/index', '/pages/news/home/index', '/pages/aiHelper/home/index', '/pages/eco/home/index', '/pages/user/home/index']
                    const findTabPageIndex = switchTabPages.findIndex(page => {
                        return (redirect || '').indexOf(page) > -1
                    })
                    if(findTabPageIndex > -1) {
                        Taro.switchTab({
                            url: decodeURIComponent(redirect || '')
                        })
                    } else {
                        Taro.redirectTo({
                            url: decodeURIComponent(redirect || '')
                        })
                    }
                } else {
                    Taro.showToast({
                        title: '绑定失败',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    }

    onGetVerificationCode = () => {
        const { dispatch } = this.props
        const { timer, phone } = this.state
        if(timer > 0) {
            return
        }
        if(!phone || phone.length != 11) {
            Taro.showToast({
                title: '请输入正确手机号',
                icon: 'none',
                duration: 2000
            })
            return
        }

        /** 获取验证码 */
        dispatch({
            type: 'bindAccount/submit',
            payload: {
                phone: phone,
            }
        })

        /** 60秒计时 */
        let time = 60
        const timerFunc = setInterval(() => {
            this.setState({ 
                timer: time--
            }, () => {
                if (time < 0) {
                    clearInterval(timerFunc);
                }
            })
        }, 1000)
    }

    render() {
        const { bindType, phone, verificationCode, account, password, timer, hiddenModal } = this.state
        const { loading, portal } = this.props

        let dom
        if(bindType === 'phone') {
            dom = (
                <View className='bindAccount'>
                    <View className="title">
                        绑定手机号
                    </View>

                    <View>
                        <AtInput
                            name='phone'
                            type='text'
                            placeholder='请输入手机号'
                            value={phone}
                            onChange={this.onChangePhone.bind(this)}
                        >
                            <View className="verificationCode" onClick={this.onGetVerificationCode.bind(this)}>{ timer > 0 ? `${timer}s后重试` : '获取验证码' }</View>
                        </AtInput>
                    </View>

                    <View>
                        <AtInput
                            name='phone'
                            type='number'
                            placeholder='请输入验证码'
                            value={verificationCode}
                            onChange={this.onChangeVerificationCode.bind(this)}
                        />
                    </View>

                    <View>
                        <AtButton loading={loading} disabled={loading} type='primary' onClick={this.onSubmitBind.bind(this, 'phone')}>绑定</AtButton>
                    </View>

                    <View className="changeBindType">
                        <Text onClick={this.onChangeBindType.bind(this, 'account')}>账号密码绑定</Text>
                    </View>
                </View>
            )
        } else {
            dom = (
                <View className='bindAccount'>
                    <View className="title">
                        账号密码绑定
                    </View>

                    <View>
                        <AtInput
                            name='account'
                            type='text'
                            placeholder='请输入账号'
                            value={account}
                            onChange={this.onChangeAccount.bind(this)}
                        />
                    </View>

                    <View>
                        <AtInput
                            name='password'
                            type='password'
                            placeholder='请输入密码'
                            value={password}
                            onChange={this.onChangePassword.bind(this)}
                        />
                    </View>

                    <View>
                        <AtButton loading={loading} disabled={loading} type='primary' onClick={this.onSubmitBind.bind(this, 'phone')}>绑定</AtButton>
                    </View>

                    <View className="changeBindType">
                        <Text onClick={this.onChangeBindType.bind(this, 'phone')}>手机号绑定</Text>
                    </View>
                </View>
            )
        }
        return (
            <View>
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
                {
                    dom
                }
            </View>
        )
    }
}

export default BindAccount;
