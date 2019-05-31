import Taro, { Component, Config } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtForm, AtButton } from "taro-ui";
import { AnswerProps, AnswerState } from "./index.interface";
import FormRadioObjitem from '../../../../pages/common/formRadioObjitem';
import { connect } from '@tarojs/redux'
import "./index.scss";
import "../../../style/formRap.scss"
const huizhang = process.env.remoteImgPreUrl + '/images/subPackageEco/answer/huizhang.png';

@connect(({ answer }) => ({
    ...answer,
}))

class AnswerDetail extends Component<AnswerProps, AnswerState> {
    config: Config = {
        navigationBarTitleText: "趣味答题"
    };
    constructor(props: AnswerProps) {
        super(props);
        this.state = {
            id: '',
            customValues: [],
            curIndex: 0,
            customList: [],
            showCover:false
        };
    }

    async componentDidMount() {
        const _this = this;
        const { dispatch } = this.props;
        await dispatch({
            type: 'answer/getPartakeDetail',
            payload: { id: this.$router.params.id }
        })
        const { questions } = this.props;

        let customValues: any = [];
        questions && questions.forEach(element => {
            customValues.push({
                id: element.id,
                must: element.must,
                answerValue: '',
                answerValueList: []
            })
        })

        let customList: any = [];
        questions && questions.forEach(element => {
            let temp: any = {
                id: element.id,
                must: element.must,
                label: element.title,
                isRequire: element.must == '1',
                type: element.type == '0' ? 'radio' : 'checkbox',
                onChange: e => {
                    _this.customAnswerChange(e, element.id, element.type)
                }
            }

            let config: any = [];
            element.answerList.forEach(obj => {
                config.push({
                    id: obj.id,
                    questionId: obj.questionId,
                    value: obj.name,
                    hasInput: obj.type == '1'
                })
            })
            temp = {
                ...temp,
                config: config
            }
            
            customList.push(temp)
        })

        console.log("customList", customList);

        this.setState({
            customList,
            customValues
        })

    }

    componentWillMount() {
        this.setState({
            id: this.$router.params.id
        });
    }

    onChangeName = e => {};

    onSubmit() {
        const { id } = this.props;
        const { customValues, customList } = this.state;
        const { dispatch } = this.props;

        // 校验自定义必填项是否填完
        for (let i = 0; i < customValues.length; i++) {
            if (customValues[i].must == '1' && (customValues[i].answerValue.trim() == '' && customValues[i].answerValueList.length <= 0)){
                Taro.showToast({
                    title:'【'+customList[i].label+'】未填写',
                    duration:2000,
                    icon:'none'
                })
                return false
            }
        }
        dispatch({
            type: 'answer/saveAnswer',
            payload: {
                id: id,
                questions: customValues
            }
        })
    };

    toNext(curIndex) {
        this.setState({
            curIndex
        });
    }

    cancelAddType = () => {};

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
                    let temp:any = [];
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
                        }else{
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

    getPartakeDetail() {
        const { dispatch } = this.props;
        dispatch({
            type: 'answer/getPartakeDetail',
            payload: {
                id: this.state.id
            },
            callback: res => {
                if(res.code == 1) {
                    const { questions } = res.data;

                    // 设置选项格式
                    let _this = this;
                    let customList: any = [];
                    let customValues: any = []
                    questions && questions.forEach(element => {
                        let temp: any = {
                            id: element.id,
                            label: element.title,
                            isRequire: element.must == '1',
                            type: element.type == '0' ? 'radio' :'checkbox',
                            onChange: e => {
                                _this.customAnswerChange(e, element.id, element.type)
                            }
                        }
                        
                        let config: any = [];
                        element.answerList.forEach(obj => {
                            config.push({
                                id: obj.id,
                                questionId: obj.questionId,
                                value: obj.name,
                                hasInput: obj.type == '1'
                            })
                        })
                        temp = {
                            ...temp,
                            config: config
                        }
                        
                        customList.push(temp);

                        customValues.push({
                            id: element.id,
                            answerValue: '',
                            answerValueList: []
                        })
                    })

                    this.setState({
                        customList,
                        customValues
                    });

                    console.log(customList);

                    return false;
                }

                Taro.showToast({
                    title: '加载出错',
                    image: '../../../images/toastError.png',
                    duration: 2000
                });
            }
        });
    }


    render() {
        const {showCover, customList, curIndex} = this.state;

        return (
            <View className="answer-wrap">
                <AtForm onSubmit={this.onSubmit.bind(this)}>
                {
                    customList && customList.map((question, index) => {
                        return (
                            <View className='container' style={`display: ${ index== curIndex ? 'block': 'none'}`} key={ question.id }>
                                <View className="head">
                                    <Text>第{ index + 1 } /{ customList.length }题</Text>
                                </View>
                                <View className="title">
                                    <Text className="option-type">{ question.type == 1 ? '多选' : '单选' }</Text>
                                    <Text>{ index + 1 }.{ question.label }</Text>
                                </View>

                                <View className='formContent'>
                                    <FormRadioObjitem formItem={question} />
                                </View>
                                
                                { 
                                    (index + 1) == customList.length ? 
                                    <AtButton type='primary' className='footer' formType='submit'>交卷</AtButton> :
                                    <View className='footer' onClick={ this.toNext.bind(this, index + 1) }>下一题</View>
                                }
                                
                            </View>
                        )
                    })
                }
                </AtForm>

                <View className={`${showCover ? 'sysShow' : 'sysHide'}`}>
                    <View className="opacityCover" onClick={ this.cancelAddType }></View>
                    <View className="popup">
                        <Image src={huizhang} mode='widthFix' />
                        <View className='title'>恭喜你答对2题目</View>
                        <View className='money'>5.2<Text>元</Text></View> 
                        <View className='info'>已将红包存入你的帐户</View>
                    </View>
                </View>
            </View>
        );
    }
}

export default AnswerDetail;
