import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Switch, Image, Text } from '@tarojs/components'
import { AddFormItemProps, AddFormItemState } from './index.interface'
import { connect } from '@tarojs/redux'
const remoteImgPreUrl = process.env.remoteImgPreUrl
import './index.scss'
import "../../../style/formRap.scss"
import { element } from 'prop-types';
@connect(({ survey }) => ({
    ...survey
}))
class AddTypesForm extends Component<AddFormItemProps, AddFormItemState> {
    config: Config = {
        navigationBarTitleText: '发布投票调查'
    }
    constructor(props: AddFormItemProps) {
        super(props)
        this.state = {
            grayDelet: remoteImgPreUrl + "images/subPackageEco/grayDelet.png",
            atcAddIcon: remoteImgPreUrl + "images/subPackageEco/addxm.png",
            placeholder: '',
            addOtherDisabled: false,
            question: {
                index: 0,
                must: '1',
                type: '',
                title: '',
                answerList: []
            }
        }
    }

    componentDidMount() {
        if (this.$router.params.index) {
            const { questions } = this.props;
            this.setState({
                question: questions[this.$router.params.index]
            });
        } else {
            const placeholder = this.$router.params.placeholder;
            const type = this.$router.params.type;
            this.setState({
                placeholder: placeholder ? placeholder : '',
                question: {
                    ...this.state.question,
                    type: type
                }
            });
        }

    }
    // 添加选项
    addOption() {
        let { answerList } = this.state.question;
        const index: number = answerList.length;
        answerList.push({
            index: index,
            name: '',
            type: '0'
        })
        this.setState({
            question: {
                ...this.state.question,
                answerList
            }
        })
    }
    addOtherOption() {
        if (!this.state.addOtherDisabled) {
            let { answerList } = this.state.question;
            const index: number = answerList.length;
            answerList.push({
                index: index,
                name: '其他选项__',
                type: '1'
            })
            this.setState({
                addOtherDisabled: true,
                question: {
                    ...this.state.question,
                    answerList
                }
            })
        }
    }

    inputTitle(e) {
        const inputValue = e.detail.value;
        this.setState({
            question: {
                ...this.state.question,
                title: inputValue
            }
        });
    }

    // 输入 提示语监听
    inputOptionName(index, e) {

        const inputValue = e.detail.value;
        let { answerList } = this.state.question;
        answerList[index].name = inputValue;
        this.setState({
            question: {
                ...this.state.question,
                answerList
            }
        });
    }

    // 删除选项 
    deleteOption(index, type, e) {
        e.stopPropagation();// 阻止冒泡
        let { answerList } = this.state.question;
        answerList.splice(index, 1);
        if (type === '1') {
            this.setState({
                addOtherDisabled: false,
                question: {
                    ...this.state.question
                    // title: e.detail.value
                }
            });
        } else {
            this.setState({
                question: {
                    ...this.state.question
                    //title: e.detail.value
                }
            });
        }

    }


    // 点击 保存
    saveEvt() {
        let { questions, dispatch } = this.props;
        if (this.$router.params.index) {
            questions.splice(this.$router.params.index, 1, this.state.question)
        } else {
            questions.push(this.state.question)
        }
        dispatch({
            type: 'survey/updateState',
            payload: {
                questions
            }
        })
        Taro.navigateBack({
            delta: 1
        })
    }

    // 点击 删除
    deletEvt() {
        let { questions, dispatch } = this.props;
        if (this.$router.params.index) {
            questions.splice(this.$router.params.index, 1)
            dispatch({
                type: 'survey/updateState',
                payload: {
                    questions
                }
            })
        }
        
        Taro.navigateBack({
            delta: 1
        })
    }

    render() {
        const { grayDelet, placeholder, atcAddIcon, question, addOtherDisabled } = this.state;
        return (
            <View className='addFormItem-wrap'>

                <View className="posrel formList">
                    <Input className="label labelInput" value={question.title} type='text' maxLength={80} onInput={this.inputTitle.bind(this)}
                        placeholder={`请输入${placeholder}标题`} focus />
                </View>
                {
                    question.answerList && question.answerList.map((element, index) => {
                        return (
                            element.type === '0' ? (
                                <View className="posrel formList">
                                    <Input className="label labelInput" value={element.name} type='text' maxLength={80} onInput={this.inputOptionName.bind(this, index)}
                                        placeholder={`请输入${placeholder}选项`} focus />
                                    <Image className='grayDeletIcon active' src={grayDelet} mode="aspectFill"
                                        onClick={this.deleteOption.bind(this, index, '0')} />
                                </View>
                            ) : (
                                    <View className="posrel formList">
                                        <Input className="label labelInput" value={`其他选项__`} type='text' maxLength={80} onInput={this.inputOptionName.bind(this, 0)}
                                            placeholder={`请输入${placeholder}选项`} disabled />
                                        <Image className='grayDeletIcon active' src={grayDelet} mode="aspectFill"
                                            onClick={this.deleteOption.bind(this, index, '1')} />
                                    </View>
                                )
                        )
                    })
                }

                {
                    // 问答题 不 显示增加选项按钮
                    question.type !== '3' && (
                        <View className='flex'>
                            <View className='flex-item van-hairline--right' onClick={this.addOption}>
                                <Image className='atcAddIcon' src={atcAddIcon} mode="aspectFill" />
                                <Text className="atcAddTxt">增加选项</Text>
                            </View>
                            <View className='flex-item' onClick={this.addOtherOption}>
                                <Image className='atcAddIcon' src={atcAddIcon} mode="aspectFill" />
                                <Text className={`atcAddTxt ${addOtherDisabled ? 'disabled' : ''}`} >增加“其他__”项</Text>
                            </View>
                        </View>
                    )
                }


                <View className="btnContain">
                    <View className="redBgBtn" onClick={this.saveEvt}>保存</View>
                    {
                        // 如果 是从 新增自定义项目 跳过来的（placeholder有值的时候） 才显示删除按钮，
                        placeholder ? null : <View className="whiteBgBtn" onClick={this.deletEvt}>删除</View>
                    }

                </View>
            </View>
        )
    }
}

export default AddTypesForm
