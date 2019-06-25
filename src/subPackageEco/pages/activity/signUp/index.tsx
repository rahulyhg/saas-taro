import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Picker, Block } from '@tarojs/components'
import { AtForm, AtButton, AtInput, AtListItem, AtTextarea, AtImagePicker } from "taro-ui";
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { SignUpProps, SignUpState } from './index.interface'
import './index.scss'
import Dimage from '../../../../pages/common/dimage'
import _lodash from 'underscore'
import DjLoading from '@/src/pages/common/djLoading';
import FormObjItem from '../../../../pages/common/formObjItem';
@connect(({ activitySignUp, loading }) => ({
    ...activitySignUp,
    loading: loading.effects['activitySignUp/activityFormDetail']
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
        const _this = this;
        let genderItem={};
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
                    if(element.name == '性别'){
                         genderItem = {
                            id: element.id,
                            must: element.must,
                            label: element.name,
                            type: element.name == '性别' ? 'radioGroup' : 'input',
                            placeholder: '请输入' + element.name,
                            config: element.name == '性别' ? [{ id: '1', value: '男' }, { id: '0', value: '女' }] : [],
                            onChange: e => {
                                _this.preAnswerChange(e, index)
                            }
                        }
                
                        
                    }

                    preTemp.push(element);
                    
                } else {
                    customTemp.push(element);
                }
            });
        }
        this.setState({
            genderItem:genderItem,
            preOptions: preTemp,
            customOptions: customTemp
        })
    }

    //
    preAnswerChange = (e,index)=>{
        let { preOptions } = this.state;
        preOptions[index].value = e == 1 ? '男' : '女';
        this.setState({
            preOptions: preOptions
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

    // 自定义文本INPUT
    onCusInputChange = (index, e) => {
        let { customOptions } = this.state;
        //customOptions[index].value = e.detail.value;
        customOptions[index].value = e;
        this.setState({
            customOptions: customOptions
        })
    }

    // 自定义文本INPUT
    onTextChange = (index, e) => {
        let { customOptions } = this.state;
        //customOptions[index].value = e.detail.value;
        customOptions[index].value = e.detail.value;
        this.setState({
            customOptions: customOptions
        })
    }

    // 性别选择
    onSelectChange = (index, e) => {
        let { preOptions } = this.state;
        preOptions[index].value = e.detail.value == 1 ? '男' : '女';
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
        /*
        
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
        })*/

        const { dispatch } = this.props;
        dispatch({
            type: 'common/uploadSingleFile',
            payload: {
                filePath: filepath,
                businessName: 'activity'
            },
            callback: res => {
                if (res.code == 1) {
                    let { customOptions } = _this.state;
                    customOptions[index].value = res.data.path
                    customOptions[index].coverId = res.data.id
                    _this.setState({
                        customOptions: customOptions
                    })
                }
            }
        });
    }

    // 删除图片

    handleRemoveImg = (index, e) => {
        let { customOptions } = this.state;
        customOptions[index].value = '';
        this.setState({
            customOptions: customOptions
        })
    }

    onSubmit = _lodash.debounce((e) => {
        const { dispatch } = this.props;
        const { customOptions, preOptions } = this.state;
        let tempOptions: any = [];
        customOptions.forEach(element => {
            tempOptions.push({
                optionId: element.id,
                optionType: element.optionType,
                value: element.value,
                coverId: element.coverId ? element.coverId : ''
            })
        });
        preOptions.forEach(element => {
            tempOptions.push({
                optionId: element.id,
                optionType: element.optionType,
                value: element.name == '性别' ? (element.value == '' ? '男' : element.value) : element.value
            })
        });

        // 校验必填项是否填完
        for (let i = 0; i < preOptions.length; i++) {
            if (preOptions[i].must == '1' && preOptions[i].value.trim() == '' && preOptions[i].name != '性别') {
                Taro.showToast({
                    title: '【' + preOptions[i].name + '】未填写',
                    duration: 2000,
                    icon: 'none'
                })
                return false;


            }
            if (preOptions[i].name == '手机') {
                const re = /^1\d{10}$/;
                if (!re.test(preOptions[i].value.trim())) {
                    Taro.showToast({
                        title: '【' + preOptions[i].name + '】格式不正确',
                        duration: 2000,
                        icon: 'none'
                    })
                    return false;
                }
            }
        }

        // 校验必填项是否填完
        for (let i = 0; i < customOptions.length; i++) {
            if (customOptions[i].must == '1' && customOptions[i].value.trim() == '') {
                Taro.showToast({
                    title: '【' + customOptions[i].name + '】未填写',
                    duration: 2000,
                    icon: 'none'
                })
                return false
            }
        }


        dispatch({
            type: 'actEditAndResult/sumbitActivityEnter',
            payload: {
                activityId: this.$router.params.id,
                listActivityCustomValue: tempOptions
            }
        })
        console.log(this.state)
    }, 500)



    render() {
        const { activityFormData, loading } = this.props;
        const { preOptions, customOptions, files,genderItem } = this.state
        console.log(files)
        const genders = ['男', '女']
        return (
            <View className='signUp-wrap'>
                {
                    !loading && <Block>
                        <View className="header">
                            <View className="userInfo">
                                <View className='user-photo'>
                                    <Dimage src={activityFormData.createCover} type='avatar' />
                                </View>
                                <Text className="label">发起活动者：</Text>
                                <Text className="name">{activityFormData.createName}</Text>
                            </View>
                            <View className="activityName">{activityFormData.title}</View>
                            <View className="activityTime">{activityFormData.startTime} ~ {activityFormData.endTime}</View>
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
                                                                border={false}
                                                                className="input"
                                                                name={index}
                                                                type={(formItem.name == '年龄' || formItem.name == '手机') ? 'number' : 'text'}
                                                                placeholder={formItem.placeholder}
                                                                value={formItem.value || ''}
                                                                maxLength={20}
                                                                onChange={this.onInputChange.bind(this, index)}
                                                            />) : (
                                                                /*
                                                                <Picker value={formItem.value} mode='selector' range={genders} onChange={this.onSelectChange.bind(this, index)}>
                                                                    {
                                                                        formItem.value == '女' ? <AtListItem title={'女'} arrow='down' /> : <AtListItem title={'男'} arrow='down' />
                                                                    }

                                                                </Picker>
                                                                */
                                                               <FormObjItem formItem={genderItem} />
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
                                                                border={false}
                                                                className="input"
                                                                name={index}
                                                                type='text'
                                                                placeholder={formItem.placeholder}
                                                                value={formItem.value || ''}
                                                                maxLength={200}
                                                                onChange={this.onCusInputChange.bind(this, index)}
                                                            />) :

                                                            formItem.optionType == '1' ? (
                                                                <AtTextarea
                                                                    value={formItem.value || ''}
                                                                    onChange={this.onTextChange.bind(this, index)}
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
                    </Block>
                }

                <DjLoading isshow={loading} />

            </View>
        )
    }
}

export default SignUp
