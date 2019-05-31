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

class SignUp extends Component<SignUpProps, SignUpState> {
    config: Config = {
        navigationBarTitleText: '我要报名'
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
            type: 'activitySignUp/activityFormDetail',
            payload: { activityId: this.$router.params.id }
        })
        let customTemp: any = [];
        let preTemp: any = [];
        if (this.props.activityFormData.customOptionList) {
            this.props.activityFormData.customOptionList.forEach((element, index) => {
                element = {
                    ...element,
                    value: ''
                }
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

    // 预设文本

    onInputChange = (index, e) => {
        let { preOptions } = this.state;
        preOptions[index].value = e;
        this.setState({
            preOptions: preOptions
        })
    }

    // 自定义文本
    onCusInputChange = (index, e) => {
        let { customOptions } = this.state;
        customOptions[index].value = e;
        this.setState({
            customOptions: customOptions
        })
    }

    // 性别选择
    onSelectChange = (index, e) => {
        let { preOptions } = this.state;
        preOptions[index].value = e.detail.value == 0 ? '男' : '女';
        this.setState({
            preOptions: preOptions
        })
    }

    // 图片选择
    onImageChange = (index, e) => {
        let _this = this;
        Taro.chooseImage({
            count: 1,
            success: function (res) {
                let filepath = res && res.tempFilePaths[0];
                _this.uploadFile(filepath, index);
            }
        })
    }
    uploadFile = (filepath, index) => {
        let _this = this;
        Taro.uploadFile({
            url: process.env.apiHost + '/api/common/imageUpload',
            filePath: filepath,
            name: 'file',
            formData: { businessName: 'activity' }
        }).then(res => {
            console.log(res);
            let { customOptions } = this.state;
            customOptions[index].value = JSON.parse(res.data).path
            customOptions[index].coverId = JSON.parse(res.data).id
            _this.setState({
                customOptions: customOptions
            })
        })
    }

    // 删除图片

    handleRemoveImg = (index, e) => {
        let { customOptions } = this.state;
        customOptions[index].value = '';
        this.setState({
            customOptions: customOptions
        })
    }

    onSubmit = (e) => {
        const { dispatch } = this.props;
        let tempOptions: any = [];
        this.state.customOptions.forEach(element => {
            tempOptions.push({
                optionId: element.id,
                optionType: element.optionType,
                value: element.value,
                coverId: element.coverId ? element.coverId : ''
            })
        });
        this.state.preOptions.forEach(element => {
            tempOptions.push({
                optionId: element.id,
                optionType: element.optionType,
                value: element.name == '性别' ? (element.value == '' ? '男' : element.value) : element.value
            })
        });
        dispatch({
            type: 'actEditAndResult/sumbitActivityEnter',
            payload: {
                activityId: this.$router.params.id,
                listActivityCustomValue: tempOptions
            }
        })
        console.log(this.state)
    }



    render() {
        const { activityFormData } = this.props;
        const { preOptions, customOptions, files } = this.state
        console.log(files)
        const genders = ['男', '女']
        return (
            <View className='signUp-wrap'>
                <View className="header">
                    <View className="userInfo">
                        <View className='user-photo'>
                            <Dimage src={activityFormData.createCover} type='avatar' />
                        </View>
                        <Text className="label">发起投票者：</Text>
                        <Text className="name">{activityFormData.createName}</Text>
                    </View>
                    <View className="activityName">{activityFormData.title}</View>
                    <View className="activityTime">{activityFormData.startTime}-{activityFormData.endTime}</View>
                </View>

                <AtForm onSubmit={this.onSubmit.bind(this)}>
                    {/* 预设表单 */}
                    <View className="presetForm">
                        {
                            preOptions && preOptions.map((formItem, index) => {
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
                                                formItem.name != '性别' ? (
                                                    <AtInput
                                                        className="input"
                                                        name={index}
                                                        type='text'
                                                        placeholder={formItem.placeholder}
                                                        value={formItem.value || ''}
                                                        onChange={this.onInputChange.bind(this, index)}
                                                    />) : (
                                                        <Picker value={formItem.value} mode='selector' range={genders} onChange={this.onSelectChange.bind(this, index)}>
                                                            {
                                                                formItem.value == '女' ? <AtListItem title={'女'} arrow='down' /> : <AtListItem title={'男'} arrow='down' />
                                                            }

                                                        </Picker>
                                                    )
                                            }

                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>

                    {/* 自定义表单 */}
                    <View className="customForm">
                        {
                            customOptions && customOptions.map((formItem, index) => {
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
                                                formItem.optionType == '0' ? (
                                                    <AtInput
                                                        className="input"
                                                        name={index}
                                                        type='text'
                                                        placeholder={formItem.placeholder}
                                                        value={formItem.value || ''}
                                                        onChange={this.onCusInputChange.bind(this, index)}
                                                    />) :

                                                    formItem.optionType == '1' ? (
                                                        <AtTextarea
                                                            value={formItem.value || ''}
                                                            onChange={this.onCusInputChange.bind(this, index)}
                                                            maxLength={200}
                                                            placeholder='请输入'
                                                        />
                                                    ) : (
                                                            <View className='at-image-picker'>

                                                                <View className='at-image-picker__flex-box'>
                                                                    {
                                                                        formItem.value != '' ? (
                                                                            <Block>
                                                                                <View className='at-image-picker__flex-item'>
                                                                                    <View className='at-image-picker__item'>
                                                                                        <View
                                                                                            className='at-image-picker__remove-btn'
                                                                                            onClick={this.handleRemoveImg.bind(this, index)}
                                                                                        ></View>
                                                                                        <Image className='at-image-picker__preview-img' src={process.env.apiBackImgPre + formItem.value} />
                                                                                    </View>
                                                                                </View>
                                                                                <View className='at-image-picker__flex-item'></View>
                                                                                <View className='at-image-picker__flex-item'></View>
                                                                            </Block>
                                                                        ) :
                                                                            (
                                                                                <Block>
                                                                                    <View className='at-image-picker__flex-item' onClick={this.onImageChange.bind(this, index)}>
                                                                                        <View className='at-image-picker__item at-image-picker__choose-btn'>
                                                                                            <View className='add-bar'></View>
                                                                                            <View className='add-bar'></View>
                                                                                        </View>
                                                                                    </View>
                                                                                    <View className='at-image-picker__flex-item'></View>
                                                                                    <View className='at-image-picker__flex-item'></View>
                                                                                </Block>
                                                                            )
                                                                    }
                                                                </View>

                                                            </View>
                                                        )
                                            }

                                        </View>
                                    </View>
                                )
                            })
                        }
                        <View className="formItem custom submit">
                            <AtButton type='primary' formType='submit'>提交</AtButton>
                        </View>
                    </View>
                </AtForm>
            </View>
        )
    }
}

export default SignUp
