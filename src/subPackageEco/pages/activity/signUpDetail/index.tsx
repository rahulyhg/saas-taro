import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Picker, Block } from '@tarojs/components'
import { AtForm, AtButton, AtInput, AtListItem, AtTextarea, AtImagePicker } from "taro-ui";
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { SignUpProps, SignUpState } from './index.interface'
import './index.scss'
import Dimage from '../../../../pages/common/dimage'
@connect(({ activitySignUp }) => ({
    ...activitySignUp,
}))

class SignUpDetail extends Component<SignUpProps, SignUpState> {
    config: Config = {
        navigationBarTitleText: '报名详情'
    }
    constructor(props: SignUpProps) {
        super(props)
        this.state = {
            files: [],
            preOptions: [],
            customOptions: []
        }
    }

    async componentDidMount() {
        const { dispatch } = this.props;
        await dispatch({
            type: 'activitySignUp/activitySignUpDetail',
            payload: { activityId: this.$router.params.activityId, detailId: this.$router.params.detailId }
        })
        let customTemp: any = [];
        let preTemp: any = [];
        if (this.props.activitySignUpDetail.customValue) {
            this.props.activitySignUpDetail.customValue.forEach((element) => {

                if (element.type == '0') {
                    preTemp.push(element);
                } else {
                    customTemp.push(element);
                }
            });
        }
        this.setState({
            preOptions: preTemp,
            customOptions: customTemp
        })
    }






    render() {
        const { activitySignUpDetail } = this.props;
        const { preOptions, customOptions } = this.state
        return (
            <View className='signUp-wrap'>
                <View className="header">
                    <View className="userInfo">
                        <View className='user-photo'>
                            <Dimage src={activitySignUpDetail.createCover} type='avatar' />
                        </View>
                        <Text className="label">发起投票者：</Text>
                        <Text className="name">{activitySignUpDetail.createName}</Text>
                    </View>
                    <View className="activityName">{activitySignUpDetail.title}</View>
                    <View className="activityTime">{activitySignUpDetail.startTime}-{activitySignUpDetail.endTime}</View>
                </View>


                {/* 预设表单 */}
                {
                    preOptions.length > 0 && <View className="presetForm">
                        {
                            preOptions.map((formItem, index) => {
                                return (
                                    <View key={index} className="formItem">
                                        <View className="formLabel">
                                            {
                                                formItem.must == '1' ? <Text className='require'>*</Text> : ''
                                            }
                                            {formItem.name}
                                        </View>
                                        <View className="formContent">
                                            {
                                                formItem.value
                                            }

                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                }


                {/* 自定义表单 */}
                {
                    customOptions.length > 0 && <View className="customForm">
                        {
                            customOptions.map((formItem, index) => {
                                return (
                                    <View key={formItem.optionId} className="formItem">
                                        <View className="formLabel">
                                            {
                                                formItem.must == '1' ? <Text className='require'>*</Text> : ''
                                            }
                                            {formItem.name}
                                        </View>
                                        <View className="formContent">
                                            {
                                                formItem.value
                                            }

                                        </View>
                                    </View>
                                )
                            })
                        }

                    </View>
                }


            </View>
        )
    }
}

export default SignUpDetail
