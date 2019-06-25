import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Block } from '@tarojs/components'
import { AtForm, AtButton, AtIcon } from "taro-ui";
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { SurveyDetailProps, SurveyDetailState } from './index.interface'
import './index.scss'
import FormObjItem from '../../../../pages/common/formObjItem';
import FormRadioObjitem from '../../../../pages/common/formRadioObjitem';
import Dimage from '../../../../pages/common/dimage'
import _lodash from 'underscore';
import { element } from 'prop-types';
import DjLoading from '@/src/pages/common/djLoading';
@connect(({ surveyJoin, loading }) => ({
    ...surveyJoin,
    loading: loading.effects['surveyJoin/getPartakeDetail']
}))
class SurveyDetail extends Component<SurveyDetailProps, SurveyDetailState> {
    config: Config = {
        navigationBarTitleText: '调查'
    }
    constructor(props: SurveyDetailProps) {
        super(props)
        this.state = {
            preOptionList: [],
            customList: []
        }
    }

    async componentDidMount() {
        const _this = this;
        const { dispatch } = this.props;
        await dispatch({
            type: 'surveyJoin/getPartakeDetail',
            payload: { id: this.$router.params.id }
        })
        let returnQuestions: any = []
        this.props.customOptions && this.props.customOptions.forEach(element => {
            returnQuestions.push({
                optionId: element.id,
                must: element.must,
                value: ''
            })
        })

        let customValues: any = []
        this.props.questions && this.props.questions.forEach(element => {
            customValues.push({
                id: element.id,
                must: element.must,
                answerValue: '',
                answerValueList: []
            })
        })


        const { customOptions, questions } = this.props;

        let preOptionList: any = [];
        customOptions && customOptions.forEach(element => {
            preOptionList.push({
                id: element.id,
                must: element.must,
                label: element.name,
                type: element.name == '性别' ? 'radioGroup' : 'input',
                placeholder: '请输入' + element.name,
                config: element.name == '性别' ? [{ id: '1', value: '男' }, { id: '0', value: '女' }] : [],
                onChange: e => {
                    _this.preAnswerChange(e, element.id)
                }
            })
        })

        let customList: any = [];
        questions && questions.forEach(element => {
            let temp: any = {
                id: element.id,
                must: element.must,
                label: element.title,
                isRequire: element.must == '1',
                type: element.type == '0' ? 'radio' : (element.type == '1' ? 'checkbox' : 'textarea'),
                onChange: e => {
                    _this.customAnswerChange(e, element.id, element.type)
                }
            }
            if (element.type == '2') {
                temp = {
                    ...temp,
                    config: { placeholder: '请输入' + element.name }
                }
            } else {
                let config: any = [];
                element.answerList.forEach(obj => {
                    config.push({
                        id: obj.id,
                        questionId: obj.questionId,
                        value: obj.name,
                        hasInput: obj.type == '1',
                        onOtherChange: (e) => {
                            _this.onOtherChange(e, obj.questionId, obj.id, element.type)
                        }
                    })
                })
                temp = {
                    ...temp,
                    config: config
                }
            }
            customList.push(temp)
        })
        this.setState({
            preOptionList: preOptionList,
            customList: customList,
            customValues: customValues,
            returnQuestions: returnQuestions
        })

    }


    onSubmit = _lodash.debounce((e) => {
        const { id } = this.props;
        const { returnQuestions, customValues, preOptionList, customList } = this.state;
        const { dispatch } = this.props;

        // 校验必填项是否填完
        for (let i = 0; i < returnQuestions.length; i++) {
            if (returnQuestions[i].must == '1' && returnQuestions[i].value.trim() == '') {
                Taro.showToast({
                    title: '【' + preOptionList[i].label + '】未填写',
                    duration: 2000,
                    icon: 'none'
                })
                return false
            }
        }

        // 校验自定义必填项是否填完
        for (let i = 0; i < customValues.length; i++) {
            if (customValues[i].must == '1' && (customValues[i].answerValue.trim() == '' && customValues[i].answerValueList.length <= 0)) {
                Taro.showToast({
                    title: '【' + customList[i].label + '】未填写',
                    duration: 2000,
                    icon: 'none'
                })
                return false
            }
        }
        dispatch({
            type: 'surveyJoin/saveAnswer',
            payload: {
                id: id,
                questions: customValues,
                customValues: returnQuestions
            }
        })
    }, 500)


    // 预设选项
    preAnswerChange(e, optionId) {
        // TODO:性别单选验证
        console.log(e, optionId);
        let { returnQuestions } = this.state;
        returnQuestions.forEach((element, index) => {
            if (element.optionId == optionId) {
                //element.value = e;
                element.value = this.props.customOptions[index].name == '性别' ? (e == '1' ? '男' : '女') : e;
            }
        })

        this.setState({
            returnQuestions: returnQuestions
        })
    }


    // 自定义选项
    customAnswerChange(e, questionId, type) {

        console.log(e, questionId);
        let { customValues } = this.state;
        customValues.forEach(element => {
            if (element.id == questionId) {
                if (type == '2') {
                    element.answerValue = e.detail.value;
                } else if (type == '0') {
                    element.answerValueList = [{
                        answerId: JSON.parse(e.detail.value).id
                    }]
                } else {
                    const list = e.detail.value;
                    const { answerValueList } = element;
                    let temp: any = [];
                    list.forEach(item => {
                        let findIndex = -1;
                        for (let i = 0; i < answerValueList.length; i++) {
                            if (answerValueList[i].answerId == JSON.parse(item).id) {
                                findIndex = i;
                            }
                        }
                        if (findIndex <= -1) {
                            temp.push({
                                answerId: JSON.parse(item).id,
                                value: ''
                            })
                        } else {
                            temp.push(answerValueList[findIndex])
                        }

                    });

                    element.answerValueList = temp;

                }
            }
        })
        this.setState({
            customValues: customValues
        })
    }

    // 其他输入
    onOtherChange = (e, questionId, optionId, type) => {
        let { customValues } = this.state;
        customValues.forEach(element => {
            if (element.id == questionId) {
                if (type == '0') {
                    element.answerValueList = [{
                        answerId: optionId,
                        value: e
                    }]
                } else {
                    element.answerValueList.forEach(item => {
                        if (item.answerId == optionId) {
                            item.value = e;
                        }
                    })
                }
            }
        })
        this.setState({
            customValues: customValues
        })
    }
    // 页面分享事件
    onShareAppMessage() {
        const { title } = this.props;
        return {
            title: title,
            path: '/subPackageEco/pages/survey/detail/index?id=' + this.$router.params.id,
            imageUrl: process.env.remoteImgPreUrl + 'images/common/shareDefaultImg.png'

        }
    }


    render() {
        const { title, createByName, createByCover, startTime, endTime, loading } = this.props;
        const startDate = startTime ? startTime.substring(0, 10) : '';
        const endDate = endTime ? endTime.substring(0, 10) : '';

        const { preOptionList, customList } = this.state;


        return (
            <View className='surveyDetail-wrap'>
                {
                    !loading && <Block>
                        <View className="header">
                            <View className="userInfo">
                                <View>
                                    <View className='user-photo'><Dimage type='avatar' src={createByCover} /></View>
                                    <Text className="label">发起调查者：</Text>
                                    <Text className="name">{createByName}</Text>
                                </View>
                                <AtButton size="normal" openType='share'><AtIcon prefixClass="icon icon-zhuanfa1" value='chevron-down' size='14' color='rgba(153, 153, 153, 1)' /></AtButton>

                            </View>
                            <View className="activityName">{title}</View>
                            <View className="activityTime">{startDate} ~ {endDate}</View>
                        </View>

                        <AtForm onSubmit={this.onSubmit.bind(this)}>
                            {/* 预设表单 */}
                            {
                                preOptionList.length > 0 && <View className="presetForm">
                                    {
                                        preOptionList && preOptionList.map(formItem => {
                                            return (
                                                <View key={formItem.id} className="formItem">
                                                    <View className="formLabel">
                                                        <Text className={formItem.must == '1' ? 'red' : 'white'}>*</Text>{formItem.label}
                                                    </View>
                                                    <View className="formContent">
                                                        <FormObjItem formItem={formItem} />
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            }


                            {/* 单选/多选表单 */}
                            <View className="customForm">
                                {
                                    customList && customList.map(formItem => {
                                        return (
                                            <View key={formItem.typeName} className="formItem custom">
                                                <View className='formLabel'>
                                                    <Text className={formItem.must == '1' ? 'red' : 'white'}>*</Text>
                                                    {
                                                        formItem.type === 'textarea' ? <Text className='type'>问答</Text> : (formItem.type === 'radio' ? <Text className='type'>单选</Text> : <Text className='type'>多选</Text>)
                                                    }
                                                    {formItem.label}
                                                </View>
                                                <View className='formContent'>
                                                    <FormRadioObjitem formItem={formItem} />
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

export default SurveyDetail
